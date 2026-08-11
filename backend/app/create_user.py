## don't do anything in this file, this is for testing purpose.

from supabase import create_client

SUPABASE_URL = "https://thpdxgxmxbtortfqngko.supabase.co"
SUPABASE_KEY = "sb_publishable_gUOXMrNDdtELxysEHU-Qbg_5rQSx-3A"

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

response = supabase.auth.sign_up(
    {
        "email": "perfectscore0001@gmail.com",
        "password": "perfectscorepassword123"
    }
)

print(response)