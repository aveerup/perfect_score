from __future__ import annotations

import json
import os
from collections.abc import Callable
from typing import Any

from fastapi.encoders import jsonable_encoder

try:
    from redis import Redis
    from redis.exceptions import RedisError
except ImportError:  # Redis is optional unless REDIS_URL is configured.
    Redis = None  # type: ignore[assignment]
    RedisError = Exception  # type: ignore[assignment,misc]


CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL_SECONDS", "1800"))
REDIS_URL = os.getenv("REDIS_URL", "")


def create_redis_client() -> Any | None:
    if not REDIS_URL or Redis is None:
        return None

    try:
        return Redis.from_url(REDIS_URL, decode_responses=True)
    except (RedisError, ValueError):
        return None


redis_client = create_redis_client()


def user_cache_key(user_id: str, name: str) -> str:
    return f"cache:user:{user_id}:{name}"


def common_cache_key(name: str) -> str:
    return f"cache:common:{name}"


def user_index_key(user_id: str) -> str:
    return f"cache:index:user:{user_id}"


def get_json(key: str) -> Any | None:
    if redis_client is None:
        return None

    try:
        raw = redis_client.get(key)
        return json.loads(raw) if raw else None
    except (RedisError, json.JSONDecodeError):
        return None


def set_json(
    key: str,
    value: Any,
    *,
    ttl: int = CACHE_TTL_SECONDS,
    user_id: str | None = None,
) -> None:
    if redis_client is None:
        return

    try:
        payload = json.dumps(jsonable_encoder(value), separators=(",", ":"))
        redis_client.setex(key, ttl, payload)

        if user_id:
            index_key = user_index_key(user_id)
            redis_client.sadd(index_key, key)
            redis_client.expire(index_key, ttl + 60)
    except RedisError:
        return


def cached_json(
    key: str,
    builder: Callable[[], Any],
    *,
    ttl: int = CACHE_TTL_SECONDS,
    user_id: str | None = None,
) -> Any:
    cached = get_json(key)
    if cached is not None:
        return cached

    value = builder()
    set_json(key, value, ttl=ttl, user_id=user_id)
    return value


def cached_user_json(
    user_id: str,
    name: str,
    builder: Callable[[], Any],
    *,
    ttl: int = CACHE_TTL_SECONDS,
) -> Any:
    return cached_json(
        user_cache_key(user_id, name),
        builder,
        ttl=ttl,
        user_id=user_id,
    )


def cached_common_json(
    name: str,
    builder: Callable[[], Any],
    *,
    ttl: int = CACHE_TTL_SECONDS,
) -> Any:
    return cached_json(common_cache_key(name), builder, ttl=ttl)


def delete_user_cache(user_id: str) -> None:
    if redis_client is None:
        return

    try:
        index_key = user_index_key(user_id)
        keys = list(redis_client.smembers(index_key))
        if keys:
            redis_client.delete(*keys)
        redis_client.delete(index_key)
    except RedisError:
        return
