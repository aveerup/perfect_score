from __future__ import annotations

import csv
from pathlib import Path
import sys
from typing import Any
from uuid import NAMESPACE_URL, uuid5

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from app.data import IELTS_ESSAYS, MOCK_TESTS, PRACTICE_QUESTIONS, VOCABULARY_WORDS
from app.db import db_connection, jsonb
from app.study_plan_catalog import STUDY_PLAN_CATALOG


LISTENING_TESTS: list[dict[str, Any]] = [
    {
        "test_no": 1,
        "title": "Listening Practice Set 1 - Everyday Conversation",
        "category": "Easy",
        "audio_path": "ielts-listening-practice/test-1.mp3",
        "questions": [
            {
                "id": "lt1-q1",
                "number": 1,
                "type": "MCQ",
                "prompt": "When does the beginner course start?",
                "options": ["Monday, 8 June", "Monday, 8 July", "Friday, 8 July", "Monday, 18 July"],
            },
            {
                "id": "lt1-q2",
                "number": 2,
                "type": "MCQ",
                "prompt": "Which class does the student choose?",
                "options": ["Morning class", "Afternoon class", "Evening class", "Weekend class"],
            },
            {
                "id": "lt1-q3",
                "number": 3,
                "type": "MCQ",
                "prompt": "What is included in the course fee?",
                "options": ["A notebook", "Printed materials", "Transport", "Exam registration"],
            },
            {"id": "lt1-q4", "number": 4, "type": "Gap Filling", "prompt": "Maximum class size: ______ students"},
            {"id": "lt1-q5", "number": 5, "type": "Gap Filling", "prompt": "Course fee: GBP ______"},
            {"id": "lt1-q6", "number": 6, "type": "Gap Filling", "prompt": "Early registration discount: ______%"},
            {"id": "lt1-q7", "number": 7, "type": "Gap Filling", "prompt": "Location: ______ Street"},
            {"id": "lt1-q8", "number": 8, "type": "Gap Filling", "prompt": "Students must upload a copy of their ______"},
            {"id": "lt1-q9", "number": 9, "type": "Short Answer", "prompt": "What should students bring to class?"},
            {"id": "lt1-q10", "number": 10, "type": "Short Answer", "prompt": "What building is the centre next to?"},
            {"id": "lt1-q11", "number": 11, "type": "Short Answer", "prompt": "How can students register?"},
        ],
        "answers": {
            "lt1-q1": "Monday, 8 July",
            "lt1-q2": "Evening class",
            "lt1-q3": "Printed materials",
            "lt1-q4": ["12", "twelve"],
            "lt1-q5": "280",
            "lt1-q6": "10",
            "lt1-q7": "King",
            "lt1-q8": "passport",
            "lt1-q9": ["a notebook", "notebook and pen", "a notebook and pen"],
            "lt1-q10": "public library",
            "lt1-q11": ["online", "on the website"],
        },
    },
    {
        "test_no": 2,
        "title": "Listening Practice Set 2 - Campus Conversation",
        "category": "Easy",
        "audio_path": "ielts-listening-practice/test-2.mp3",
        "questions": [
            {
                "id": "lt2-q1",
                "number": 1,
                "type": "MCQ",
                "prompt": "When will the presentation take place?",
                "options": ["Tuesday morning", "Tuesday afternoon", "Thursday morning", "Thursday afternoon"],
            },
            {
                "id": "lt2-q2",
                "number": 2,
                "type": "MCQ",
                "prompt": "What is the final presentation topic?",
                "options": [
                    "Plastic waste in oceans",
                    "Reducing plastic waste on campus",
                    "Recycling in local schools",
                    "Student eating habits",
                ],
            },
            {
                "id": "lt2-q3",
                "number": 3,
                "type": "MCQ",
                "prompt": "What will Daniel prepare?",
                "options": ["The introduction", "The waste report", "Charts for survey data", "The conclusion only"],
            },
            {"id": "lt2-q4", "number": 4, "type": "Gap Filling", "prompt": "Professor's name: Professor ______"},
            {"id": "lt2-q5", "number": 5, "type": "Gap Filling", "prompt": "Maya will discuss the problem and some ______"},
            {"id": "lt2-q6", "number": 6, "type": "Gap Filling", "prompt": "Daniel will use survey results from their ______"},
            {"id": "lt2-q7", "number": 7, "type": "Gap Filling", "prompt": "Meeting place: science building ______"},
            {"id": "lt2-q8", "number": 8, "type": "Gap Filling", "prompt": "Meeting time: ______"},
            {"id": "lt2-q9", "number": 9, "type": "Short Answer", "prompt": "Who will discuss possible solutions?"},
            {"id": "lt2-q10", "number": 10, "type": "Short Answer", "prompt": "How long is the main presentation?"},
            {"id": "lt2-q11", "number": 11, "type": "Short Answer", "prompt": "What will Daniel bring tomorrow?"},
        ],
        "answers": {
            "lt2-q1": "Thursday afternoon",
            "lt2-q2": "Reducing plastic waste on campus",
            "lt2-q3": "Charts for survey data",
            "lt2-q4": "Lewis",
            "lt2-q5": "statistics",
            "lt2-q6": "class",
            "lt2-q7": ["cafe", "cafe"],
            "lt2-q8": "3:15",
            "lt2-q9": "Aisha",
            "lt2-q10": ["twelve minutes", "12 minutes"],
            "lt2-q11": ["his laptop", "laptop"],
        },
    },
    {
        "test_no": 3,
        "title": "Listening Practice Set 3 - Hotel Booking",
        "category": "Medium",
        "audio_path": "ielts-listening-practice/test-3.mp3",
        "questions": [
            {
                "id": "lt3-q1",
                "number": 1,
                "type": "MCQ",
                "prompt": "How long will the guest stay?",
                "options": ["One night", "Two nights", "Three nights", "Four nights"],
            },
            {
                "id": "lt3-q2",
                "number": 2,
                "type": "MCQ",
                "prompt": "What type of room does the guest book?",
                "options": ["Single", "Double", "Family", "Twin"],
            },
            {
                "id": "lt3-q3",
                "number": 3,
                "type": "MCQ",
                "prompt": "What is free at the hotel?",
                "options": ["Dinner", "Lake view", "Parking", "Airport transfer"],
            },
            {"id": "lt3-q4", "number": 4, "type": "Gap Filling", "prompt": "Arrival date: ______ August"},
            {"id": "lt3-q5", "number": 5, "type": "Gap Filling", "prompt": "Departure date: ______ August"},
            {"id": "lt3-q6", "number": 6, "type": "Gap Filling", "prompt": "Room price: GBP ______ per night"},
            {"id": "lt3-q7", "number": 7, "type": "Gap Filling", "prompt": "Lake-view extra cost: GBP ______ per night"},
            {"id": "lt3-q8", "number": 8, "type": "Gap Filling", "prompt": "Guest surname: ______"},
            {"id": "lt3-q9", "number": 9, "type": "Short Answer", "prompt": "What meal is included?"},
            {"id": "lt3-q10", "number": 10, "type": "Short Answer", "prompt": "Where is the parking area?"},
            {"id": "lt3-q11", "number": 11, "type": "Short Answer", "prompt": "How will confirmation be sent?"},
        ],
        "answers": {
            "lt3-q1": "Two nights",
            "lt3-q2": "Double",
            "lt3-q3": "Parking",
            "lt3-q4": ["14th", "14"],
            "lt3-q5": ["16th", "16"],
            "lt3-q6": "95",
            "lt3-q7": "15",
            "lt3-q8": "Carter",
            "lt3-q9": "breakfast",
            "lt3-q10": "behind the hotel",
            "lt3-q11": "by email",
        },
    },
    {
        "test_no": 4,
        "title": "Listening Practice Set 4 - Museum Tour",
        "category": "Medium",
        "audio_path": "ielts-listening-practice/test-4.mp3",
        "questions": [
            {
                "id": "lt4-q1",
                "number": 1,
                "type": "MCQ",
                "prompt": "How long will the tour last?",
                "options": ["30 minutes", "60 minutes", "90 minutes", "120 minutes"],
            },
            {
                "id": "lt4-q2",
                "number": 2,
                "type": "MCQ",
                "prompt": "Where will the tour finish?",
                "options": ["At the entrance", "In the main courtyard", "In the cafe", "On the second floor"],
            },
            {
                "id": "lt4-q3",
                "number": 3,
                "type": "MCQ",
                "prompt": "What is not allowed in most areas?",
                "options": ["Taking photographs", "Flash photography", "Carrying tickets", "Visiting exhibitions"],
            },
            {"id": "lt4-q4", "number": 4, "type": "Gap Filling", "prompt": "Visitors need tickets for the special ______."},
            {"id": "lt4-q5", "number": 5, "type": "Gap Filling", "prompt": "The tour starts on the ______ floor."},
            {"id": "lt4-q6", "number": 6, "type": "Gap Filling", "prompt": "Roman objects are displayed on the ______ floor."},
            {"id": "lt4-q7", "number": 7, "type": "Gap Filling", "prompt": "The old map room has maps from the ______ century."},
            {"id": "lt4-q8", "number": 8, "type": "Gap Filling", "prompt": "The museum shop closes at ______ p.m."},
            {"id": "lt4-q9", "number": 9, "type": "Short Answer", "prompt": "Which area is currently closed?"},
            {"id": "lt4-q10", "number": 10, "type": "Short Answer", "prompt": "Where are the toilets?"},
            {"id": "lt4-q11", "number": 11, "type": "Short Answer", "prompt": "What is usually the most popular part of the tour?"},
        ],
        "answers": {
            "lt4-q1": "90 minutes",
            "lt4-q2": "In the main courtyard",
            "lt4-q3": "Flash photography",
            "lt4-q4": "exhibition",
            "lt4-q5": "ground",
            "lt4-q6": "ground",
            "lt4-q7": ["seventeenth", "17th"],
            "lt4-q8": "6",
            "lt4-q9": ["the cafe", "cafe"],
            "lt4-q10": "beside the information desk",
            "lt4-q11": "old map room",
        },
    },
    {
        "test_no": 5,
        "title": "Listening Practice Set 5 - Student Accommodation",
        "category": "Hard",
        "audio_path": "ielts-listening-practice/test-5.mp3",
        "questions": [
            {
                "id": "lt5-q1",
                "number": 1,
                "type": "MCQ",
                "prompt": "What type of accommodation does the student prefer?",
                "options": ["Private housing", "University halls", "A family house", "A studio apartment"],
            },
            {
                "id": "lt5-q2",
                "number": 2,
                "type": "MCQ",
                "prompt": "Why does the officer recommend Maple Hall?",
                "options": ["It is the cheapest option", "It is close to shops", "It is quieter", "It has private kitchens"],
            },
            {
                "id": "lt5-q3",
                "number": 3,
                "type": "MCQ",
                "prompt": "How long does it take to reach campus by bus?",
                "options": ["5 minutes", "10 minutes", "15 minutes", "20 minutes"],
            },
            {"id": "lt5-q4", "number": 4, "type": "Gap Filling", "prompt": "Maple Hall is mainly for ______ students."},
            {"id": "lt5-q5", "number": 5, "type": "Gap Filling", "prompt": "Walking time to campus: ______ minutes"},
            {"id": "lt5-q6", "number": 6, "type": "Gap Filling", "prompt": "Kitchens are shared by ______ students."},
            {"id": "lt5-q7", "number": 7, "type": "Gap Filling", "prompt": "Rent: GBP ______ per week"},
            {"id": "lt5-q8", "number": 8, "type": "Gap Filling", "prompt": "Application deadline: ______ June"},
            {"id": "lt5-q9", "number": 9, "type": "Short Answer", "prompt": "Where is the laundry room?"},
            {"id": "lt5-q10", "number": 10, "type": "Short Answer", "prompt": "What is included in the rent?"},
            {"id": "lt5-q11", "number": 11, "type": "Short Answer", "prompt": "When do applications open?"},
        ],
        "answers": {
            "lt5-q1": "University halls",
            "lt5-q2": "It is quieter",
            "lt5-q3": "10 minutes",
            "lt5-q4": "postgraduate",
            "lt5-q5": ["20", "twenty"],
            "lt5-q6": ["6", "six"],
            "lt5-q7": "145",
            "lt5-q8": ["15th", "15"],
            "lt5-q9": "on the ground floor",
            "lt5-q10": "bills",
            "lt5-q11": ["first of May", "1st May", "May 1st"],
        },
    },
]

READING_TESTS: list[dict[str, Any]] = [
    {
        "test_no": 4,
        "title": "Reading Practice Set 4 - Healthy Sleep",
        "category": "Easy",
        "passage": (
            "Health experts recommend that adults sleep between seven and nine hours each night. "
            "Adequate sleep supports memory, concentration, immune function and emotional "
            "well-being. However, modern lifestyles often reduce sleep quality because of long "
            "working hours and increased use of electronic devices before bedtime. Research "
            "suggests that blue light from screens may delay the body's production of melatonin, "
            "making it harder to fall asleep."
        ),
        "questions": [
            {
                "id": "rt4-q1",
                "number": 1,
                "type": "MCQ",
                "prompt": "Adults are generally advised to sleep:",
                "options": ["5-6 hours", "6-7 hours", "7-9 hours", "9-11 hours"],
            },
            {
                "id": "rt4-q2",
                "number": 2,
                "type": "MCQ",
                "prompt": "Blue light affects the production of:",
                "options": ["Insulin", "Melatonin", "Vitamin D", "Adrenaline"],
            },
            {
                "id": "rt4-q3",
                "number": 3,
                "type": "MCQ",
                "prompt": "Which factor is mentioned as reducing sleep quality?",
                "options": ["Fresh air", "Long working hours", "Exercise", "Reading books"],
            },
            {"id": "rt4-q4", "number": 4, "type": "Gap Fill", "prompt": "Adequate sleep supports ______ and concentration."},
            {"id": "rt4-q5", "number": 5, "type": "Gap Fill", "prompt": "Blue light may delay ______ production."},
            {"id": "rt4-q6", "number": 6, "type": "Gap Fill", "prompt": "Electronic devices are often used before ______."},
            {"id": "rt4-q7", "number": 7, "type": "Gap Fill", "prompt": "Adults should sleep between ______ and nine hours."},
            {"id": "rt4-q8", "number": 8, "type": "Short Answer", "prompt": "What regulates sleep?"},
            {"id": "rt4-q9", "number": 9, "type": "Short Answer", "prompt": "What devices emit blue light?"},
            {"id": "rt4-q10", "number": 10, "type": "Short Answer", "prompt": "What two lifestyle factors reduce sleep quality?"},
        ],
        "answers": {
            "rt4-q1": "7-9 hours",
            "rt4-q2": "Melatonin",
            "rt4-q3": "Long working hours",
            "rt4-q4": "memory",
            "rt4-q5": "melatonin",
            "rt4-q6": "bedtime",
            "rt4-q7": "seven",
            "rt4-q8": "melatonin",
            "rt4-q9": ["smartphones", "tablets", "smartphones/tablets", "electronic devices"],
            "rt4-q10": ["long working hours; device use", "long working hours and device use"],
        },
    },
    {
        "test_no": 5,
        "title": "Reading Practice Set 5 - Electric Vehicles",
        "category": "Medium",
        "passage": (
            "Electric vehicles (EVs) are becoming more common as governments encourage cleaner "
            "transportation. Unlike petrol cars, EVs produce no exhaust emissions while driving. "
            "However, they depend on charging infrastructure, which is still developing in many "
            "regions. Improvements in battery technology have increased driving range and reduced "
            "charging time."
        ),
        "questions": [
            {
                "id": "rt5-q1",
                "number": 1,
                "type": "MCQ",
                "prompt": "EVs produce no ______ while driving.",
                "options": ["noise", "exhaust emissions", "electricity", "heat"],
            },
            {
                "id": "rt5-q2",
                "number": 2,
                "type": "MCQ",
                "prompt": "One challenge mentioned is:",
                "options": ["expensive roads", "limited charging infrastructure", "poor steering", "high insurance"],
            },
            {
                "id": "rt5-q3",
                "number": 3,
                "type": "MCQ",
                "prompt": "Battery technology has improved:",
                "options": ["colour", "driving range", "tyre size", "fuel quality"],
            },
            {"id": "rt5-q4", "number": 4, "type": "Gap Fill", "prompt": "Governments promote ______ transportation."},
            {"id": "rt5-q5", "number": 5, "type": "Gap Fill", "prompt": "EVs rely on charging ______."},
            {"id": "rt5-q6", "number": 6, "type": "Gap Fill", "prompt": "Better batteries increase driving ______."},
            {"id": "rt5-q7", "number": 7, "type": "Gap Fill", "prompt": "Charging time has been ______."},
            {"id": "rt5-q8", "number": 8, "type": "Short Answer", "prompt": "What do EVs not produce while driving?"},
            {"id": "rt5-q9", "number": 9, "type": "Short Answer", "prompt": "What is still developing?"},
            {"id": "rt5-q10", "number": 10, "type": "Short Answer", "prompt": "What has reduced because of better batteries?"},
        ],
        "answers": {
            "rt5-q1": "exhaust emissions",
            "rt5-q2": "limited charging infrastructure",
            "rt5-q3": "driving range",
            "rt5-q4": "cleaner",
            "rt5-q5": "infrastructure",
            "rt5-q6": "range",
            "rt5-q7": "reduced",
            "rt5-q8": "exhaust emissions",
            "rt5-q9": "charging infrastructure",
            "rt5-q10": "charging time",
        },
    },
    {
        "test_no": 6,
        "title": "Reading Practice Set 6 - Public Libraries",
        "category": "Easy",
        "passage": (
            "Modern public libraries provide far more than books. Many offer free internet "
            "access, computer training, study rooms and community events. These services help "
            "people of different ages develop new skills and access information. Although digital "
            "media has become increasingly popular, libraries continue to play an important social "
            "role."
        ),
        "questions": [
            {
                "id": "rt6-q1",
                "number": 1,
                "type": "MCQ",
                "prompt": "Libraries offer more than:",
                "options": ["computers", "books", "events", "study rooms"],
            },
            {
                "id": "rt6-q2",
                "number": 2,
                "type": "MCQ",
                "prompt": "Which service is mentioned?",
                "options": ["Free internet", "Gym", "Cinema", "Swimming pool"],
            },
            {
                "id": "rt6-q3",
                "number": 3,
                "type": "MCQ",
                "prompt": "Libraries help people:",
                "options": ["avoid education", "develop new skills", "travel abroad", "buy books"],
            },
            {"id": "rt6-q4", "number": 4, "type": "Gap Fill", "prompt": "Libraries provide free ______ access."},
            {"id": "rt6-q5", "number": 5, "type": "Gap Fill", "prompt": "They organize community ______."},
            {"id": "rt6-q6", "number": 6, "type": "Gap Fill", "prompt": "Study ______ are available."},
            {"id": "rt6-q7", "number": 7, "type": "Gap Fill", "prompt": "Libraries continue to play an important ______ role."},
            {"id": "rt6-q8", "number": 8, "type": "Short Answer", "prompt": "Who benefits from library services?"},
            {"id": "rt6-q9", "number": 9, "type": "Short Answer", "prompt": "What has become more popular?"},
            {"id": "rt6-q10", "number": 10, "type": "Short Answer", "prompt": "Besides books, name one service."},
        ],
        "answers": {
            "rt6-q1": "books",
            "rt6-q2": "Free internet",
            "rt6-q3": "develop new skills",
            "rt6-q4": "internet",
            "rt6-q5": "events",
            "rt6-q6": "rooms",
            "rt6-q7": "social",
            "rt6-q8": "people of different ages",
            "rt6-q9": "digital media",
            "rt6-q10": ["computer training", "free internet", "study rooms"],
        },
    },
]

WRITING_TASK1_TESTS: list[dict[str, Any]] = [
    {
        "set_no": 1,
        "category": "Easy",
        "title": "Writing Task 1 Set 1 - Line Graph: Museum Visitors",
        "prompt": "The line graph shows the number of visitors to three museums between 2018 and 2022.",
        "visualType": "Line Graph",
        "data": {
            "columns": ["Year", "Museum A", "Museum B", "Museum C"],
            "rows": [
                ["2018", "50,000", "70,000", "40,000"],
                ["2019", "60,000", "65,000", "45,000"],
                ["2020", "55,000", "40,000", "30,000"],
                ["2021", "75,000", "50,000", "35,000"],
                ["2022", "90,000", "55,000", "45,000"],
            ],
        },
    },
    {
        "set_no": 2,
        "category": "Easy",
        "title": "Writing Task 1 Set 2 - Bar Chart: Household Spending",
        "prompt": "The bar chart compares the percentage of household spending on four categories in four countries.",
        "visualType": "Bar Chart",
        "data": {
            "columns": ["Country", "Food", "Housing", "Transport", "Entertainment"],
            "rows": [
                ["UK", "18%", "35%", "22%", "25%"],
                ["Canada", "20%", "32%", "24%", "24%"],
                ["Australia", "16%", "38%", "20%", "26%"],
                ["Japan", "28%", "25%", "18%", "29%"],
            ],
        },
    },
    {
        "set_no": 3,
        "category": "Medium",
        "title": "Writing Task 1 Set 3 - Pie Charts: Energy Sources",
        "prompt": "The pie charts compare the sources of energy used in a country in 2000 and 2020.",
        "visualType": "Pie Charts",
        "data": {
            "columns": ["Source", "2000", "2020"],
            "rows": [["Coal", "45%", "20%"], ["Gas", "25%", "30%"], ["Renewables", "10%", "35%"], ["Nuclear", "20%", "15%"]],
        },
    },
    {
        "set_no": 4,
        "category": "Medium",
        "title": "Writing Task 1 Set 4 - Table: Internet Access by Age Group",
        "prompt": "The table shows the percentage of people using the internet daily in three age groups in 2010, 2015 and 2020.",
        "visualType": "Table",
        "data": {
            "columns": ["Age group", "2010", "2015", "2020"],
            "rows": [["16-24", "82%", "91%", "96%"], ["25-44", "65%", "78%", "88%"], ["45-64", "38%", "55%", "72%"]],
        },
    },
    {
        "set_no": 5,
        "category": "Medium",
        "title": "Writing Task 1 Set 5 - Process Diagram: Recycling Plastic Bottles",
        "prompt": "The diagram illustrates the process of recycling plastic bottles into new products.",
        "visualType": "Process Diagram",
        "data": {
            "columns": ["Stage", "Description"],
            "rows": [
                ["1", "Used plastic bottles are collected from recycling bins."],
                ["2", "The bottles are transported to a recycling centre."],
                ["3", "They are sorted and unsuitable materials are removed."],
                ["4", "The plastic is washed and crushed into small flakes."],
                ["5", "The flakes are melted and formed into pellets."],
                ["6", "The pellets are used to manufacture new plastic products."],
            ],
        },
    },
    {
        "set_no": 6,
        "category": "Hard",
        "title": "Writing Task 1 Set 6 - Map: Library Layout Changes",
        "prompt": "The maps show changes to a public library between 2010 and 2025.",
        "visualType": "Map",
        "data": {
            "columns": ["Area", "2010", "2025"],
            "rows": [
                ["North side", "Reference books", "Computer zone"],
                ["Centre", "Reading tables", "Open study area"],
                ["South-west", "Children section", "Children section expanded"],
                ["South-east", "Newspapers", "Cafe"],
                ["Entrance", "Reception desk", "Self-service machines"],
            ],
        },
    },
    {
        "set_no": 7,
        "category": "Hard",
        "title": "Writing Task 1 Set 7 - Mixed Chart: Water Use and Population",
        "prompt": "The table compares water use by sector, while the line data shows population growth in the same country.",
        "visualType": "Mixed Chart",
        "data": {
            "columns": ["Category", "2000", "2020"],
            "rows": [
                ["Agriculture water use", "70%", "55%"],
                ["Industry water use", "20%", "30%"],
                ["Domestic water use", "10%", "15%"],
                ["Population", "30 million", "45 million"],
            ],
        },
    },
]

WRITING_TASK2_TESTS: list[dict[str, Any]] = [
    {
        "set_no": 1,
        "category": "Easy",
        "title": "Writing Task 2 Set 1 - Opinion Essay",
        "essayType": "Opinion Essay",
        "prompt": "Some people believe that university education should be free for everyone. Others think students should pay for their own education. To what extent do you agree or disagree?",
    },
    {
        "set_no": 2,
        "category": "Easy",
        "title": "Writing Task 2 Set 2 - Discussion Essay",
        "essayType": "Discussion Essay",
        "prompt": "Some people think governments should invest more in public transport, while others believe building new roads is a better solution. Discuss both views and give your opinion.",
    },
    {
        "set_no": 3,
        "category": "Medium",
        "title": "Writing Task 2 Set 3 - Advantages and Disadvantages",
        "essayType": "Advantages and Disadvantages",
        "prompt": "Many people now work from home instead of travelling to an office every day. What are the advantages and disadvantages of this development?",
    },
    {
        "set_no": 4,
        "category": "Medium",
        "title": "Writing Task 2 Set 4 - Problem and Solution",
        "essayType": "Problem and Solution",
        "prompt": "Traffic congestion is becoming a serious problem in many cities. What problems does this cause, and what measures can be taken to solve them?",
    },
    {
        "set_no": 5,
        "category": "Medium",
        "title": "Writing Task 2 Set 5 - Two-Part Question",
        "essayType": "Two-Part Question",
        "prompt": "Nowadays many people spend less time with their families because of work commitments. Why is this happening? Is this a positive or negative development?",
    },
    {
        "set_no": 6,
        "category": "Medium",
        "title": "Writing Task 2 Set 6 - Opinion Essay",
        "essayType": "Opinion Essay",
        "prompt": "Some people believe that children should start learning a foreign language at primary school rather than secondary school. To what extent do you agree or disagree?",
    },
    {
        "set_no": 7,
        "category": "Hard",
        "title": "Writing Task 2 Set 7 - Discussion Essay",
        "essayType": "Discussion Essay",
        "prompt": "Some people think that the best way to improve public health is to increase sports facilities. Others believe other measures are more effective. Discuss both views and give your opinion.",
    },
    {
        "set_no": 8,
        "category": "Hard",
        "title": "Writing Task 2 Set 8 - Advantages and Disadvantages",
        "essayType": "Advantages and Disadvantages",
        "prompt": "More people are buying goods online instead of shopping in physical stores. What are the advantages and disadvantages of this trend?",
    },
    {
        "set_no": 9,
        "category": "Hard",
        "title": "Writing Task 2 Set 9 - Problem and Solution",
        "essayType": "Problem and Solution",
        "prompt": "Many young people today do not get enough physical exercise. What problems can this cause, and what solutions can you suggest?",
    },
    {
        "set_no": 10,
        "category": "Hard",
        "title": "Writing Task 2 Set 10 - Two-Part Question",
        "essayType": "Two-Part Question",
        "prompt": "In many countries, fewer people are choosing to become teachers. Why is this happening? What can be done to encourage more people to enter the profession?",
    },
]


def skill_name(skill: str) -> str:
    return {
        "L": "Listening",
        "R": "Reading",
        "W": "Writing",
        "S": "Speaking",
    }[skill]


def generated_questions(item: dict[str, Any], count: int = 5) -> list[dict[str, Any]]:
    if item["skill"] == "R":
        return [
            {
                "id": f"{item['id']}-q{i}",
                "number": i,
                "prompt": "Does the statement agree with the passage?",
                "type": item["subType"],
                "options": ["TRUE", "FALSE", "NOT GIVEN"],
                "answer": "FALSE" if i % 3 == 0 else "TRUE",
            }
            for i in range(1, count + 1)
        ]
    if item["skill"] == "L":
        answers = [
            "gallery",
            "Tuesday",
            "student",
            "45",
            "north",
            "library",
            "morning",
            "ticket",
            "station",
            "online",
        ]
        return [
            {
                "id": f"{item['id']}-q{i}",
                "number": i,
                "prompt": "Complete the note with the correct word or number.",
                "type": item["subType"],
                "answer": answers[i - 1],
            }
            for i in range(1, count + 1)
        ]
    if item["skill"] == "W":
        return [
            {
                "id": f"{item['id']}-q1",
                "number": 1,
                "prompt": item["title"],
                "type": item["subType"],
                "targetWords": 150 if "Task 1" in item["title"] else 250,
            }
        ]
    return [
        {
            "id": f"{item['id']}-q1",
            "number": 1,
            "prompt": item["title"],
            "type": item["subType"],
            "prepSeconds": 60,
            "speakSeconds": 120,
        }
    ]


def section_content(skill: str) -> dict[str, Any]:
    if skill == "L":
        return {
            "audioUrl": None,
            "segments": [{"id": "s1", "label": "Section 1", "timestamp": 0}],
        }
    if skill == "R":
        return {
            "passage": (
                "The Academic Reading test includes three long texts which range from "
                "descriptive and factual to discursive and analytical. They are written "
                "for a non-specialist audience and are suitable for university study."
            )
        }
    return {}


def seed_lectures(cursor: Any) -> int:
    count = 0
    with (BACKEND_DIR / "videos.csv").open(newline="", encoding="utf-8") as handle:
        for row_number, row in enumerate(csv.DictReader(handle), start=2):
            source_key = f"videos.csv:{row_number}"
            cursor.execute(
                """
                insert into public.lectures (
                  source_key, title, vimeo_id, skill, duration, published_at,
                  description, band_range, is_published
                )
                values (%s, %s, %s, %s, %s, %s, %s, %s, true)
                on conflict (source_key) do update set
                  title = excluded.title,
                  vimeo_id = excluded.vimeo_id,
                  skill = excluded.skill,
                  duration = excluded.duration,
                  published_at = excluded.published_at
                """,
                (
                    source_key,
                    row["title"].strip(),
                    row["vimeo_id"].strip(),
                    row["skill"].strip().upper(),
                    row.get("duration", "").strip() or None,
                    row["published_at"].strip(),
                    f"{skill_name(row['skill'].strip().upper())} IELTS masterclass.",
                    "6.0-9.0",
                ),
            )
            count += 1
    return count


def upsert_test(cursor: Any, item: dict[str, Any], test_type: str) -> None:
    time_limit = 3600 if test_type == "mock" else (1200 if item.get("skill") in {"W", "S"} else 900)
    cursor.execute(
        """
        insert into public.tests (
          id, test_type, title, skill, subtype, difficulty, band_range,
          time_limit_seconds, metadata, is_published
        )
        values (%s, %s, %s, %s, %s, %s, %s, %s, %s, true)
        on conflict (id) do update set
          title = excluded.title,
          skill = excluded.skill,
          subtype = excluded.subtype,
          difficulty = excluded.difficulty,
          band_range = excluded.band_range,
          time_limit_seconds = excluded.time_limit_seconds,
          metadata = excluded.metadata,
          is_published = true
        """,
        (
            item["id"],
            test_type,
            item.get("title") or f"Mock Test {item['number']}",
            item.get("skill"),
            item.get("subType"),
            item.get("difficulty"),
            item.get("bandRange"),
            time_limit,
            jsonb({"number": item.get("number")}),
        ),
    )


def upsert_section(
    cursor: Any,
    test_id: str,
    name: str,
    skill: str,
    position: int,
    time_limit: int,
    content: dict[str, Any],
) -> str:
    section_id = str(uuid5(NAMESPACE_URL, f"perfect-score:{test_id}:{position}"))
    cursor.execute(
        """
        insert into public.test_sections (
          id, test_id, name, skill, position, time_limit_seconds, content
        )
        values (%s, %s, %s, %s, %s, %s, %s)
        on conflict (test_id, position) do update set
          name = excluded.name,
          skill = excluded.skill,
          time_limit_seconds = excluded.time_limit_seconds,
          content = excluded.content
        returning id
        """,
        (section_id, test_id, name, skill, position, time_limit, jsonb(content)),
    )
    return str(cursor.fetchone()["id"])


def upsert_questions(cursor: Any, section_id: str, questions: list[dict[str, Any]]) -> None:
    for question in questions:
        metadata = {
            key: value
            for key, value in question.items()
            if key not in {"id", "number", "prompt", "type", "options", "answer"}
        }
        cursor.execute(
            """
            insert into public.questions (
              id, section_id, number, prompt, question_type, options,
              correct_answer, metadata
            )
            values (%s, %s, %s, %s, %s, %s, %s, %s)
            on conflict (id) do update set
              section_id = excluded.section_id,
              number = excluded.number,
              prompt = excluded.prompt,
              question_type = excluded.question_type,
              options = excluded.options,
              correct_answer = excluded.correct_answer,
              metadata = excluded.metadata
            """,
            (
                question["id"],
                section_id,
                question["number"],
                question["prompt"],
                question["type"],
                jsonb(question.get("options")) if question.get("options") is not None else None,
                jsonb(question.get("answer")) if question.get("answer") is not None else None,
                jsonb(metadata),
            ),
        )


def seed_tests(cursor: Any) -> tuple[int, int]:
    question_count = 0
    cursor.execute(
        """
        update public.tests
        set is_published = false
        where test_type = 'practice' and skill in ('R', 'W')
        """
    )
    practice_items = [item for item in PRACTICE_QUESTIONS if item["skill"] not in {"L", "R", "W"}]
    for item in practice_items:
        upsert_test(cursor, item, "practice")
        section_id = upsert_section(
            cursor,
            item["id"],
            skill_name(item["skill"]),
            item["skill"],
            1,
            1200 if item["skill"] in {"W", "S"} else 900,
            section_content(item["skill"]),
        )
        questions = generated_questions(item, 1 if item["skill"] in {"W", "S"} else 5)
        upsert_questions(cursor, section_id, questions)
        question_count += len(questions)

    for mock in MOCK_TESTS:
        upsert_test(cursor, mock, "mock")
        mock_sections = [
            ("Listening", "L", 1800),
            ("Reading", "R", 3600),
            ("Writing", "W", 3600),
            ("Speaking", "S", 840),
        ]
        for position, (name, skill, time_limit) in enumerate(mock_sections, start=1):
            content = section_content(skill)
            if skill == "W":
                content["prompt"] = "Summarize the information by selecting and reporting the main features."
            if skill == "S":
                content["question"] = "Describe a historical building you have visited and liked."
            section_id = upsert_section(
                cursor, mock["id"], name, skill, position, time_limit, content
            )
            item = {
                "id": f"{mock['id']}-{skill.lower()}",
                "skill": skill,
                "subType": "Mock Section",
                "title": content.get("prompt") or content.get("question") or name,
            }
            questions = generated_questions(item, 10 if skill in {"L", "R"} else 1)
            upsert_questions(cursor, section_id, questions)
            question_count += len(questions)

    return len(practice_items) + len(MOCK_TESTS), question_count


def seed_listening_tests(cursor: Any) -> int:
    for test in LISTENING_TESTS:
        cursor.execute(
            """
            insert into public.listening_tests (
              test_no, question, category, answer, audio_path, title, subtype,
              band_range, time_limit_seconds, is_published
            )
            values (%s, %s, %s, %s, %s, %s, %s, %s, %s, true)
            on conflict (test_no) do update set
              question = excluded.question,
              category = excluded.category,
              answer = excluded.answer,
              audio_path = excluded.audio_path,
              title = excluded.title,
              subtype = excluded.subtype,
              band_range = excluded.band_range,
              time_limit_seconds = excluded.time_limit_seconds,
              is_published = true
            """,
            (
                test["test_no"],
                jsonb(test["questions"]),
                test["category"],
                jsonb(test["answers"]),
                test["audio_path"],
                test["title"],
                "IELTS Listening",
                "6.0-9.0",
                1800,
            ),
        )
    return len(LISTENING_TESTS)


def seed_reading_tests(cursor: Any) -> int:
    for test in READING_TESTS:
        cursor.execute(
            """
            insert into public.reading_tests (
              test_no, category, questions, answers
            )
            values (%s, %s, %s, %s)
            on conflict (test_no) do update set
              category = excluded.category,
              questions = excluded.questions,
              answers = excluded.answers
            """,
            (
                test["test_no"],
                test["category"],
                jsonb(
                    {
                        "title": test["title"],
                        "passage": test["passage"],
                        "questions": test["questions"],
                    }
                ),
                jsonb(test["answers"]),
            ),
        )
    return len(READING_TESTS)


def writing_questions_payload(test: dict[str, Any], task_type: str) -> dict[str, Any]:
    target_words = 150 if task_type == "task1" else 250
    prompt_suffix = (
        "Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
        if task_type == "task1"
        else "Write a complete IELTS Task 2 essay. Give reasons for your answer and include relevant examples."
    )
    question = {
        "id": f"wt-{task_type}-{test['set_no']}-q1",
        "number": 1,
        "type": "Long Writing",
        "prompt": f"{test['prompt']}\n\n{prompt_suffix}",
        "targetWords": target_words,
        "taskType": task_type,
        **({"visualType": test.get("visualType"), "data": test.get("data")} if task_type == "task1" else {}),
        **({"essayType": test.get("essayType")} if task_type == "task2" else {}),
    }
    return {
        "title": test["title"],
        "targetWords": target_words,
        "questions": [question],
    }


def writing_answers_payload(task_type: str) -> dict[str, Any]:
    return {
        "scoringMode": "basic",
        "targetWords": 150 if task_type == "task1" else 250,
        "criteria": [
            "Task Response",
            "Coherence & Cohesion",
            "Lexical Resource",
            "Grammar Range & Accuracy",
        ],
        "note": "Open-response writing task; full criterion scoring can be added later.",
    }


def seed_writing_tests(cursor: Any) -> int:
    count = 0
    for task_type, tests in (("task1", WRITING_TASK1_TESTS), ("task2", WRITING_TASK2_TESTS)):
        for test in tests:
            cursor.execute(
                """
                insert into public.writing_tests (
                  set_no, task_type, questions, answers, category
                )
                values (%s, %s, %s, %s, %s)
                on conflict (set_no, task_type) do update set
                  questions = excluded.questions,
                  answers = excluded.answers,
                  category = excluded.category
                """,
                (
                    test["set_no"],
                    task_type,
                    jsonb(writing_questions_payload(test, task_type)),
                    jsonb(writing_answers_payload(task_type)),
                    test["category"],
                ),
            )
            count += 1
    return count


def seed_typing(cursor: Any) -> int:
    for passage in IELTS_ESSAYS:
        cursor.execute(
            """
            insert into public.typing_passages (id, title, task_type, content, is_published)
            values (%s, %s, %s, %s, true)
            on conflict (id) do update set
              title = excluded.title,
              task_type = excluded.task_type,
              content = excluded.content,
              is_published = true
            """,
            (passage["id"], passage["title"], passage["type"], passage["content"]),
        )
    return len(IELTS_ESSAYS)


def seed_vocabulary(cursor: Any, replace_existing: bool = False) -> int:
    if replace_existing:
        word_ids = [word["id"] for word in VOCABULARY_WORDS]
        cursor.execute(
            "delete from public.vocabulary_words where id <> all(%s::text[])",
            (word_ids,),
        )
    for word in VOCABULARY_WORDS:
        cursor.execute(
            """
            insert into public.vocabulary_words (
              id, word, group_name, word_type, english_meaning, bangla_meaning,
              sentence, sentence_bangla_meaning
            )
            values (%s, %s, %s, %s, %s, %s, %s, %s)
            on conflict (id) do update set
              word = excluded.word,
              group_name = excluded.group_name,
              word_type = excluded.word_type,
              english_meaning = excluded.english_meaning,
              bangla_meaning = excluded.bangla_meaning,
              sentence = excluded.sentence,
              sentence_bangla_meaning = excluded.sentence_bangla_meaning
            """,
            (
                word["id"],
                word["word"],
                word["group"],
                word["type"],
                word["englishMeaning"],
                word["banglaMeaning"],
                word["sentence"],
                word["sentenceBanglaMeaning"],
            ),
        )
    return len(VOCABULARY_WORDS)


def seed_study_plan_catalog(cursor: Any) -> int:
    for plan in STUDY_PLAN_CATALOG:
        cursor.execute(
            """
            insert into public.plans (title, details)
            values (%s, %s)
            on conflict (title) do update set
              details = excluded.details
            """,
            (plan["title"], jsonb(plan["details"])),
        )
    return len(STUDY_PLAN_CATALOG)


def main() -> None:
    with db_connection() as connection:
        with connection.cursor() as cursor:
            lecture_count = seed_lectures(cursor)
            test_count, question_count = seed_tests(cursor)
            listening_count = seed_listening_tests(cursor)
            reading_count = seed_reading_tests(cursor)
            writing_count = seed_writing_tests(cursor)
            typing_count = seed_typing(cursor)
            vocabulary_count = seed_vocabulary(cursor)
            study_plan_count = seed_study_plan_catalog(cursor)
        connection.commit()

    print(
        "Seeded "
        f"{lecture_count} lectures, {test_count} tests, {question_count} questions, "
        f"{listening_count} listening tests, {reading_count} reading tests, "
        f"{writing_count} writing tests, "
        f"{typing_count} typing passages, "
        f"{vocabulary_count} vocabulary words, "
        f"and {study_plan_count} study plans."
    )


if __name__ == "__main__":
    main()
