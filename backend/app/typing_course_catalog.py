from __future__ import annotations

from typing import Any


def exercise(
    exercise_id: str,
    kind: str,
    title: str,
    text: str,
    guidance: str,
) -> dict[str, Any]:
    words = text.split()
    shift = max(1, len(words) // 3)
    rotated = " ".join(words[shift:] + words[:shift])
    interleaved = " ".join(words[::2] + words[1::2])
    is_sentence = text[:1].isupper() or any(mark in text for mark in ".?!")

    if kind == "challenge":
        rounds = [text, f"{text} {text}", f"{text} {text} {text}"]
    elif is_sentence:
        rounds = [text, f"{text} {text}", f"{text} {text}"]
    else:
        rounds = [text, rotated, f"{interleaved} {text}"]

    return {
        "id": exercise_id,
        "kind": kind,
        "title": title,
        "text": text,
        "guidance": guidance,
        "rounds": rounds,
    }


TYPING_COURSE: list[dict[str, Any]] = [
    {
        "id": "day-01-home-position",
        "day": 1,
        "title": "Find your home position",
        "focus": "F J A S D K L ;",
        "keys": ["a", "s", "d", "f", "j", "k", "l", ";"],
        "durationMinutes": 15,
        "targetAccuracy": 90,
        "targetWpm": 8,
        "instructions": [
            "Sit tall with relaxed shoulders and keep both feet supported.",
            "Rest your left fingers on A S D F and your right fingers on J K L ;.",
            "Feel the raised bumps on F and J, and return there after every reach.",
        ],
        "exercises": [
            exercise("1-warmup", "warmup", "Home-row anchors", "fff jjj fff jjj ddd kkk sss lll aaa ;;;", "Keep your index fingers on the raised F and J keys."),
            exercise("1-patterns", "guided", "Balanced reaches", "asdf jkl; asdf jkl; fj dk sl a; fj dk sl a;", "Use one finger per key and keep your wrists quiet."),
            exercise("1-challenge", "challenge", "First rhythm check", "sad lad fall flask salad ask dad lass", "Look at the screen, not the keyboard."),
        ],
    },
    {
        "id": "day-02-home-row",
        "day": 2,
        "title": "Control the home row",
        "focus": "Home-row words",
        "keys": ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
        "durationMinutes": 18,
        "targetAccuracy": 90,
        "targetWpm": 10,
        "instructions": [
            "Add G with the left index finger and H with the right index finger.",
            "Move only the finger you need, then return it to the home row.",
            "Aim for an even rhythm instead of bursts of speed.",
        ],
        "exercises": [
            exercise("2-warmup", "warmup", "Index-finger reaches", "fgf fgf jhj jhj fghj fghj gh gh gh", "Stretch to G and H, then return to F and J."),
            exercise("2-words", "guided", "Home-row words", "had has dash flash glass hall shall glad salsa", "Let the correct finger do each movement."),
            exercise("2-challenge", "challenge", "Home-row sentence", "a glad lad had a flask; a sad lass had a salad", "Stay accurate through spaces and punctuation."),
        ],
    },
    {
        "id": "day-03-top-left",
        "day": 3,
        "title": "Reach to the top left",
        "focus": "Q W E R T",
        "keys": ["q", "w", "e", "r", "t"],
        "durationMinutes": 18,
        "targetAccuracy": 90,
        "targetWpm": 11,
        "instructions": [
            "Reach upward from A S D F: A to Q, S to W, D to E, and F to R or T.",
            "Return each finger to its home key after the reach.",
            "Keep your eyes on the highlighted key and trust your fingers.",
        ],
        "exercises": [
            exercise("3-warmup", "warmup", "Top-left ladders", "aqa sws ded frf ftf aq sw de fr ft", "Make small upward reaches without moving your whole hand."),
            exercise("3-words", "guided", "Left-side words", "were tree start water after great street sweet", "Pause if needed, but do not look down."),
            exercise("3-challenge", "challenge", "Left-side rhythm", "we were set after a great start", "Use a light touch and keep a steady pace."),
        ],
    },
    {
        "id": "day-04-top-right",
        "day": 4,
        "title": "Complete the top row",
        "focus": "Y U I O P",
        "keys": ["y", "u", "i", "o", "p"],
        "durationMinutes": 18,
        "targetAccuracy": 90,
        "targetWpm": 12,
        "instructions": [
            "Reach upward from J K L ;: J to Y or U, K to I, L to O, and ; to P.",
            "Use the same pinky for P and semicolon.",
            "Keep both index fingers aware of F and J while the other fingers reach.",
        ],
        "exercises": [
            exercise("4-warmup", "warmup", "Top-right ladders", "jyj juj kik lol ;p; jy ju ki lo ;p", "Reach up, strike lightly, and come home."),
            exercise("4-words", "guided", "Top-row words", "you your people quiet power type write", "Notice which hand types each part of a word."),
            exercise("4-challenge", "challenge", "Whole top-row sentence", "write your reply to the quiet people", "Keep your gaze one or two characters ahead."),
        ],
    },
    {
        "id": "day-05-bottom-left",
        "day": 5,
        "title": "Reach to the bottom left",
        "focus": "Z X C V B",
        "keys": ["z", "x", "c", "v", "b"],
        "durationMinutes": 18,
        "targetAccuracy": 90,
        "targetWpm": 13,
        "instructions": [
            "Reach downward from A S D F: A to Z, S to X, D to C, and F to V or B.",
            "Curl the finger down instead of dropping your wrist.",
            "B belongs to the left index finger in this course.",
        ],
        "exercises": [
            exercise("5-warmup", "warmup", "Bottom-left ladders", "aza sxs dcd fvf fbf az sx dc fv fb", "Keep the unused fingers resting gently on home row."),
            exercise("5-words", "guided", "Bottom-left words", "cab cave base brave exact voice zebra", "Return to F after both V and B."),
            exercise("5-challenge", "challenge", "Left-hand control", "a brave voice creates exact results", "Favor accuracy over speed on C, V, and B."),
        ],
    },
    {
        "id": "day-06-bottom-right",
        "day": 6,
        "title": "Complete the letter keys",
        "focus": "N M , . /",
        "keys": ["n", "m", ",", ".", "/"],
        "durationMinutes": 18,
        "targetAccuracy": 90,
        "targetWpm": 14,
        "instructions": [
            "Reach downward from J K L ;: J to N or M, K to comma, L to period, and ; to slash.",
            "Use your right index finger for both N and M.",
            "You now know every letter—keep returning to F and J.",
        ],
        "exercises": [
            exercise("6-warmup", "warmup", "Bottom-right ladders", "jnj jmj k,k l.l ;/; jn jm k, l. ;/", "Move the fingers, not the entire hand."),
            exercise("6-words", "guided", "All-letter words", "name moment learn calm number minimum zone", "Keep the right index finger controlled between N and M."),
            exercise("6-challenge", "challenge", "Alphabet checkpoint", "calm hands make every movement feel natural.", "Finish with smooth spaces and a precise period."),
        ],
    },
    {
        "id": "day-07-short-words",
        "day": 7,
        "title": "Build words without looking",
        "focus": "Common short words",
        "keys": list("abcdefghijklmnopqrstuvwxyz"),
        "durationMinutes": 20,
        "targetAccuracy": 90,
        "targetWpm": 15,
        "instructions": [
            "Read the whole word, then let your fingers type it as one pattern.",
            "Use either thumb for the space bar; choose one and stay consistent.",
            "If you lose your position, find the F and J bumps without looking.",
        ],
        "exercises": [
            exercise("7-warmup", "warmup", "Word shapes", "the and for you are can one all new use", "Type each short word as a single movement."),
            exercise("7-words", "guided", "Everyday words", "time work study learn skill focus start finish", "Let the space after each word reset your rhythm."),
            exercise("7-challenge", "challenge", "One-week checkpoint", "you can learn this skill one calm word at a time", "Complete the line without looking at the keyboard."),
        ],
    },
    {
        "id": "day-08-capitals-punctuation",
        "day": 8,
        "title": "Add capitals and punctuation",
        "focus": "Shift . , ' ? !",
        "keys": ["shift", ".", ",", "'", "?", "!"],
        "durationMinutes": 20,
        "targetAccuracy": 90,
        "targetWpm": 15,
        "instructions": [
            "Hold Shift with the hand opposite the letter you capitalize.",
            "Use the right pinky for apostrophe and nearby punctuation; use the left pinky for 1 and !.",
            "Release Shift immediately after the capital or symbol.",
        ],
        "exercises": [
            exercise("8-warmup", "warmup", "Capital pairs", "Aa Ss Dd Ff Jj Kk Ll", "Use the opposite Shift key for every capital."),
            exercise("8-words", "guided", "Names and pauses", "Maya, James, Lila, Omar, and Zoe.", "Use the right middle finger for comma and ring finger for period."),
            exercise("8-challenge", "challenge", "A complete thought", "Today, I'll type calmly. Will you? Yes!", "Watch Shift timing and return to home row."),
        ],
    },
    {
        "id": "day-09-numbers-symbols",
        "day": 9,
        "title": "Use numbers and useful symbols",
        "focus": "0–9 @ - :",
        "keys": list("1234567890@-:"),
        "durationMinutes": 20,
        "targetAccuracy": 90,
        "targetWpm": 14,
        "instructions": [
            "Reach to the number row with the finger assigned to the column below it.",
            "Use Shift with 2 for @ and Shift with ; for colon.",
            "Number-row accuracy matters more than speed.",
        ],
        "exercises": [
            exercise("9-warmup", "warmup", "Number pairs", "11 22 33 44 55 66 77 88 99 00", "Return to the home row after every number."),
            exercise("9-words", "guided", "Useful details", "Room 12, Level 4, Test 9, Day 15", "Keep your hands anchored while reaching upward."),
            exercise("9-challenge", "challenge", "Contact details", "Email: learner2@example.com - 10:30", "Use Shift for the colon and at sign."),
        ],
    },
    {
        "id": "day-10-common-words",
        "day": 10,
        "title": "Strengthen common words",
        "focus": "High-frequency English",
        "keys": list("abcdefghijklmnopqrstuvwxyz"),
        "durationMinutes": 20,
        "targetAccuracy": 90,
        "targetWpm": 17,
        "instructions": [
            "Common words should begin to feel like familiar finger patterns.",
            "Keep a small, consistent gap between words.",
            "Slow down before a difficult word instead of correcting many errors.",
        ],
        "exercises": [
            exercise("10-warmup", "warmup", "Common-word flow", "about after again because could every first", "Keep the pace even from word to word."),
            exercise("10-words", "guided", "Study vocabulary", "answer question reason example improve practice", "Read ahead while your fingers finish the current word."),
            exercise("10-challenge", "challenge", "Controlled fluency", "Regular practice will improve both speed and accuracy.", "Use a light touch from the first capital to the final period."),
        ],
    },
    {
        "id": "day-11-sentence-rhythm",
        "day": 11,
        "title": "Develop sentence rhythm",
        "focus": "Phrases and sentences",
        "keys": list("abcdefghijklmnopqrstuvwxyz"),
        "durationMinutes": 20,
        "targetAccuracy": 92,
        "targetWpm": 18,
        "instructions": [
            "Look a few characters ahead instead of staring at the current key.",
            "Let punctuation create a natural pause without stopping completely.",
            "Maintain relaxed shoulders as the passage becomes longer.",
        ],
        "exercises": [
            exercise("11-warmup", "warmup", "Phrase groups", "in the morning on the other hand as a result", "See each phrase as a group rather than isolated letters."),
            exercise("11-words", "guided", "Sentence cadence", "Clear ideas become easier to express with regular practice.", "Keep moving through the sentence at one calm pace."),
            exercise("11-challenge", "challenge", "Rhythm checkpoint", "When accuracy becomes a habit, speed begins to grow naturally.", "Look ahead and allow the sentence to flow."),
        ],
    },
    {
        "id": "day-12-error-repair",
        "day": 12,
        "title": "Repair difficult keys",
        "focus": "Precision under pressure",
        "keys": list("abcdefghijklmnopqrstuvwxyz"),
        "durationMinutes": 20,
        "targetAccuracy": 92,
        "targetWpm": 18,
        "instructions": [
            "The course records missed keys so you can see your weak spots.",
            "After a mistake, reset your hands on F and J before continuing.",
            "Deliberate, correct repetitions replace an unreliable movement pattern.",
        ],
        "exercises": [
            exercise("12-warmup", "warmup", "Precision pairs", "tr rt ed de ik ki ol lo nm mn cv vc", "Notice the direction of every two-key movement."),
            exercise("12-words", "guided", "Tricky transitions", "minimum people quiet create believe receive", "Give difficult transitions extra time."),
            exercise("12-challenge", "challenge", "Accuracy reset", "Precise practice creates reliable movement and quiet confidence.", "If you miss, breathe, find F and J, and continue."),
        ],
    },
    {
        "id": "day-13-timed-practice",
        "day": 13,
        "title": "Type against the clock",
        "focus": "Sustainable speed",
        "keys": list("abcdefghijklmnopqrstuvwxyz"),
        "durationMinutes": 20,
        "targetAccuracy": 92,
        "targetWpm": 20,
        "instructions": [
            "The timer starts on your first keystroke, so settle your hands first.",
            "Choose a pace you can sustain without a drop in accuracy.",
            "Speed is measured as five characters per word, the standard WPM formula.",
        ],
        "exercises": [
            exercise("13-warmup", "warmup", "Speed warm-up", "steady hands steady eyes steady pace steady mind", "Build pace gradually instead of sprinting."),
            exercise("13-words", "guided", "One-minute style drill", "Focus on the next word while your fingers complete the current one. Keep your hands relaxed and let every finger return home.", "Find a pace you could maintain for several minutes."),
            exercise("13-challenge", "challenge", "Timed checkpoint", "Typing quickly is useful, but typing accurately is essential. A calm and consistent rhythm produces dependable work.", "Finish strongly without trading accuracy for speed."),
        ],
    },
    {
        "id": "day-14-real-world",
        "day": 14,
        "title": "Practice real-world typing",
        "focus": "Forms and IELTS vocabulary",
        "keys": list("abcdefghijklmnopqrstuvwxyz1234567890"),
        "durationMinutes": 22,
        "targetAccuracy": 92,
        "targetWpm": 21,
        "instructions": [
            "Real tasks mix capitals, numbers, punctuation, and longer words.",
            "Scan the text before beginning so unusual details do not surprise you.",
            "Keep the same technique you used in the simple drills.",
        ],
        "exercises": [
            exercise("14-warmup", "warmup", "Form details", "Name: Samira Khan, Room 204, Start: 9:15", "Use controlled reaches for capitals, numbers, and punctuation."),
            exercise("14-words", "guided", "IELTS word bank", "education environment technology community opportunity", "Break long words into comfortable letter groups."),
            exercise("14-challenge", "challenge", "Real-world paragraph", "Modern technology can improve access to education, but every community needs a practical plan.", "Use the full keyboard with the same relaxed posture."),
        ],
    },
    {
        "id": "day-15-graduation",
        "day": 15,
        "title": "Complete your graduation test",
        "focus": "Full-keyboard confidence",
        "keys": list("abcdefghijklmnopqrstuvwxyz1234567890"),
        "durationMinutes": 25,
        "targetAccuracy": 92,
        "targetWpm": 22,
        "instructions": [
            "Use your best sustainable pace and keep your eyes on the text.",
            "Accuracy remains the passing requirement; WPM is a personal benchmark.",
            "After graduation, continue with the IELTS passage drills to build endurance.",
        ],
        "exercises": [
            exercise("15-warmup", "warmup", "Final warm-up", "calm focus accurate movement confident typing", "Settle into a smooth pace before the longer passages."),
            exercise("15-words", "guided", "Technique review", "I sit comfortably, keep my eyes on the screen, and return my fingers to F and J.", "Check posture, gaze, touch, and rhythm."),
            exercise("15-challenge", "challenge", "Graduation passage", "Touch typing is a practical skill built through patient repetition. With accurate finger movement and a steady rhythm, I can write ideas clearly without looking at the keyboard.", "This is your final accuracy check—stay calm and finish cleanly."),
        ],
    },
]


TYPING_LESSONS_BY_ID = {lesson["id"]: lesson for lesson in TYPING_COURSE}
