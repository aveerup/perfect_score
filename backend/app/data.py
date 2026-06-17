from __future__ import annotations

from datetime import date
from typing import Any


DEMO_EMAIL = "user@perfectscore.com"

DEMO_USER: dict[str, Any] = {
    "id": "u1",
    "name": "Mizbaur Rahman",
    "email": DEMO_EMAIL,
    "role": "Elite Learner",
    "joinDate": "May 2025",
    "targetScore": 8.5,
    "targetBand": 7.5,
    "currentAverage": 7.2,
    "currentBand": 6.5,
    "streak": 15,
    "location": "Dhaka, Bangladesh",
    "timezone": "GMT+6",
    "subscription": {
        "plan": "Pro",
        "status": "active",
        "renewsOn": "2026-07-01",
    },
}

VIDEOS: list[dict[str, Any]] = [
    {"id": "v1", "title": "Mastering Multiple Choice in Listening", "skill": "L", "bandRange": "6.5-7.5", "duration": "12:45", "watched": True, "progress": 100},
    {"id": "v2", "title": "True, False, Not Given: Common Pitfalls", "skill": "R", "bandRange": "7.0-8.0", "duration": "15:20", "watched": False, "progress": 45},
    {"id": "v3", "title": "Writing Task 2: Advanced Sentence Structures", "skill": "W", "bandRange": "7.0-9.0", "duration": "22:15", "watched": False, "progress": 0},
    {"id": "v4", "title": "Speaking Part 2: How to speak for 2 minutes", "skill": "S", "bandRange": "6.0-7.0", "duration": "10:30", "watched": True, "progress": 100},
    {"id": "v5", "title": "Understanding Maps and Diagrams", "skill": "L", "bandRange": "5.5-6.5", "duration": "08:50", "watched": False, "progress": 10},
    {"id": "v6", "title": "Skimming and Scanning Techniques", "skill": "R", "bandRange": "6.0-7.5", "duration": "14:10", "watched": True, "progress": 100},
    {"id": "v7", "title": "Task 1: Describing Complex Trends", "skill": "W", "bandRange": "7.0-8.5", "duration": "18:40", "watched": False, "progress": 0},
    {"id": "v8", "title": "Fluency and Coherence in Speaking", "skill": "S", "bandRange": "7.0-8.0", "duration": "11:20", "watched": False, "progress": 30},
    {"id": "v9", "title": "Listening for Synonyms and Paraphrasing", "skill": "L", "bandRange": "7.0-8.0", "duration": "13:15", "watched": False, "progress": 0},
    {"id": "v10", "title": "Matching Headings with Ease", "skill": "R", "bandRange": "6.5-7.5", "duration": "16:50", "watched": False, "progress": 0},
    {"id": "v11", "title": "Cohesion and Coherence in Essay Writing", "skill": "W", "bandRange": "6.5-8.0", "duration": "19:30", "watched": False, "progress": 0},
    {"id": "v12", "title": "Idiomatic Expressions for Band 8+", "skill": "S", "bandRange": "8.0-9.0", "duration": "09:45", "watched": False, "progress": 0},
]

PRACTICE_QUESTIONS: list[dict[str, Any]] = [
    {"id": "p1", "title": "Academic Reading: The History of Printing", "skill": "R", "subType": "True/False/Not Given", "difficulty": "Medium", "bandRange": "6.5-7.5", "attempted": True, "score": "11/13"},
    {"id": "p2", "title": "Listening Section 1: Customer Inquiry", "skill": "L", "subType": "Form Completion", "difficulty": "Easy", "bandRange": "5.5-6.5", "attempted": True, "score": "10/10"},
    {"id": "p3", "title": "Writing Task 2: Environment vs Economy", "skill": "W", "subType": "Agree/Disagree", "difficulty": "Hard", "bandRange": "7.0-8.5", "attempted": False},
    {"id": "p4", "title": "Speaking Part 3: Future of Education", "skill": "S", "subType": "Discussion Questions", "difficulty": "Medium", "bandRange": "6.0-7.5", "attempted": True, "score": "7.0"},
    {"id": "p5", "title": "Academic Reading: Renewable Energy", "skill": "R", "subType": "Matching Headings", "difficulty": "Hard", "bandRange": "7.5-8.5", "attempted": False},
    {"id": "p6", "title": "Listening Section 4: Academic Lecture", "skill": "L", "subType": "Note Completion", "difficulty": "Hard", "bandRange": "7.5-9.0", "attempted": False},
    {"id": "p7", "title": "General Training Reading: Work Habits", "skill": "R", "subType": "Multiple Choice", "difficulty": "Easy", "bandRange": "5.0-6.0", "attempted": True, "score": "38/40"},
    {"id": "p8", "title": "Writing Task 1: Comparative Table", "skill": "W", "subType": "Data Description", "difficulty": "Medium", "bandRange": "6.5-7.5", "attempted": True, "score": "6.5"},
    {"id": "p9", "title": "Speaking Part 1: Hometown and Hobbies", "skill": "S", "subType": "Introductory Questions", "difficulty": "Easy", "bandRange": "5.5-6.5", "attempted": True, "score": "8.0"},
    {"id": "p10", "title": "Listening Section 2: Local Gallery Tour", "skill": "L", "subType": "Map Labeling", "difficulty": "Medium", "bandRange": "6.0-7.0", "attempted": False},
    {"id": "p11", "title": "Academic Reading: Marine Biology", "skill": "R", "subType": "Summary Completion", "difficulty": "Medium", "bandRange": "6.5-7.5", "attempted": False},
    {"id": "p12", "title": "Writing Task 2: Remote Work Benefits", "skill": "W", "subType": "Discussion", "difficulty": "Medium", "bandRange": "6.5-8.0", "attempted": False},
    {"id": "p13", "title": "Listening Section 3: Student Project", "skill": "L", "subType": "Multiple Choice (Multiple)", "difficulty": "Hard", "bandRange": "7.0-8.5", "attempted": False},
    {"id": "p14", "title": "Speaking Part 2: A Memorable Journey", "skill": "S", "subType": "Cue Card", "difficulty": "Medium", "bandRange": "6.0-7.5", "attempted": False},
    {"id": "p15", "title": "Academic Reading: AI in Healthcare", "skill": "R", "subType": "Matching Information", "difficulty": "Hard", "bandRange": "7.5-9.0", "attempted": False},
    {"id": "p16", "title": "Writing Task 1: Process Diagram", "skill": "W", "subType": "Process Description", "difficulty": "Hard", "bandRange": "7.5-8.5", "attempted": False},
    {"id": "p17", "title": "General Training Reading: Health Policy", "skill": "R", "subType": "Sentence Completion", "difficulty": "Medium", "bandRange": "6.0-7.0", "attempted": False},
    {"id": "p18", "title": "Listening Section 4: Architecture History", "skill": "L", "subType": "Flow-chart Completion", "difficulty": "Hard", "bandRange": "7.5-9.0", "attempted": False},
    {"id": "p19", "title": "Speaking Part 3: Impact of Social Media", "skill": "S", "subType": "Abstract Discussion", "difficulty": "Hard", "bandRange": "7.5-9.0", "attempted": False},
    {"id": "p20", "title": "Academic Reading: Psychology of Play", "skill": "R", "subType": "List Selection", "difficulty": "Medium", "bandRange": "6.5-7.5", "attempted": False},
]

VOCABULARY_WORDS: list[dict[str, Any]] = [
    {"id": "v1", "word": "Automation", "category": "Technology", "definition": "The use of largely automatic equipment in a system of manufacturing or other production process.", "collocations": ["increased automation", "industrial automation"], "example": "Automation has led to significant job losses in some industries.", "masteryLevel": 4},
    {"id": "v2", "word": "Innovation", "category": "Technology", "definition": "A new method, idea, product, etc.", "collocations": ["technological innovation", "constant innovation"], "example": "Innovation is crucial for staying competitive.", "masteryLevel": 3},
    {"id": "v3", "word": "Cutting-edge", "category": "Technology", "definition": "The most advanced stage in the development of something.", "collocations": ["cutting-edge technology", "cutting-edge research"], "example": "The lab is equipped with cutting-edge technology.", "masteryLevel": 2},
    {"id": "v4", "word": "Ubiquitous", "category": "Technology", "definition": "Present, appearing, or found everywhere.", "collocations": ["ubiquitous presence", "ubiquitous technology"], "example": "Smartphones have become ubiquitous in modern society.", "masteryLevel": 1},
    {"id": "v5", "word": "Obsolescence", "category": "Technology", "definition": "The process of becoming obsolete or outdated.", "collocations": ["planned obsolescence", "rapid obsolescence"], "example": "The rapid pace of tech leads to quick obsolescence.", "masteryLevel": 2},
    {"id": "v6", "word": "Integration", "category": "Technology", "definition": "The action or process of combining two or more things in an effective way.", "collocations": ["seamless integration", "data integration"], "example": "The integration of AI into healthcare is progressing fast.", "masteryLevel": 3},
    {"id": "v7", "word": "Sedentary", "category": "Health & Medicine", "definition": "Tending to spend much time seated; somewhat inactive.", "collocations": ["sedentary lifestyle", "sedentary job"], "example": "A sedentary lifestyle can lead to health problems.", "masteryLevel": 4},
    {"id": "v8", "word": "Prevention", "category": "Health & Medicine", "definition": "The action of stopping something from happening or arising.", "collocations": ["disease prevention", "early prevention"], "example": "Prevention is better than cure.", "masteryLevel": 4},
    {"id": "v9", "word": "Eradicate", "category": "Health & Medicine", "definition": "Destroy completely; put an end to.", "collocations": ["eradicate disease", "completely eradicate"], "example": "Efforts to eradicate polio have been largely successful.", "masteryLevel": 2},
    {"id": "v10", "word": "Chronic", "category": "Health & Medicine", "definition": "Persisting for a long time or constantly recurring.", "collocations": ["chronic illness", "chronic pain"], "example": "He suffers from chronic back pain.", "masteryLevel": 3},
    {"id": "v11", "word": "Well-being", "category": "Health & Medicine", "definition": "The state of being comfortable, healthy, or happy.", "collocations": ["emotional well-being", "overall well-being"], "example": "Exercise promotes physical well-being.", "masteryLevel": 4},
    {"id": "v12", "word": "Pandemic", "category": "Health & Medicine", "definition": "A disease prevalent over a whole country or the world.", "collocations": ["global pandemic", "pandemic response"], "example": "The world was hit hard by the global pandemic.", "masteryLevel": 4},
    {"id": "v13", "word": "Curriculum", "category": "Education", "definition": "The subjects comprising a course of study in a school or college.", "collocations": ["national curriculum", "core curriculum"], "example": "The school is updating its science curriculum.", "masteryLevel": 4},
    {"id": "v14", "word": "Pedagogy", "category": "Education", "definition": "The method and practice of teaching.", "collocations": ["modern pedagogy", "effective pedagogy"], "example": "Teachers are exploring new forms of pedagogy.", "masteryLevel": 1},
    {"id": "v15", "word": "Literacy", "category": "Education", "definition": "The ability to read and write.", "collocations": ["digital literacy", "adult literacy"], "example": "Literacy rates are rising in the region.", "masteryLevel": 4},
    {"id": "v16", "word": "Inquisitive", "category": "Education", "definition": "Having or showing an interest in learning things; curious.", "collocations": ["inquisitive mind", "highly inquisitive"], "example": "Children are naturally inquisitive.", "masteryLevel": 3},
    {"id": "v17", "word": "Tertiary", "category": "Education", "definition": "Relating to education at university or college level.", "collocations": ["tertiary education", "tertiary sector"], "example": "Tertiary education is becoming more accessible.", "masteryLevel": 3},
    {"id": "v18", "word": "Rote-learning", "category": "Education", "definition": "Memorization technique based on repetition.", "collocations": ["traditional rote-learning", "rote-learning method"], "example": "Rote-learning is often criticized for lack of depth.", "masteryLevel": 3},
    {"id": "v19", "word": "Hypothesis", "category": "Science & Innovation", "definition": "A proposed explanation made on the basis of limited evidence.", "collocations": ["test a hypothesis", "working hypothesis"], "example": "The scientist formulated a new hypothesis.", "masteryLevel": 2},
    {"id": "v20", "word": "Empirical", "category": "Science & Innovation", "definition": "Based on, concerned with, or verifiable by observation or experience.", "collocations": ["empirical evidence", "empirical research"], "example": "Is there any empirical data to support this?", "masteryLevel": 1},
    {"id": "v21", "word": "Breakthrough", "category": "Science & Innovation", "definition": "A sudden, dramatic, and important discovery or development.", "collocations": ["scientific breakthrough", "major breakthrough"], "example": "This study represents a major breakthrough in cancer research.", "masteryLevel": 4},
    {"id": "v22", "word": "Synthesize", "category": "Science & Innovation", "definition": "Combine into a coherent whole or produce chemically.", "collocations": ["synthesize data", "synthesize chemicals"], "example": "They tried to synthesize the results of several studies.", "masteryLevel": 2},
    {"id": "v23", "word": "Paradigm", "category": "Science & Innovation", "definition": "A typical example or pattern of something; a model.", "collocations": ["paradigm shift", "dominant paradigm"], "example": "A new paradigm is emerging in quantum physics.", "masteryLevel": 1},
    {"id": "v24", "word": "Rigorous", "category": "Science & Innovation", "definition": "Extremely thorough, exhaustive, or accurate.", "collocations": ["rigorous testing", "rigorous analysis"], "example": "All products undergo rigorous testing.", "masteryLevel": 3},
    {"id": "v25", "word": "Democracy", "category": "Politics & Governance", "definition": "A system of government by the whole population.", "collocations": ["liberal democracy", "parliamentary democracy"], "example": "India is the world's largest democracy.", "masteryLevel": 4},
    {"id": "v26", "word": "Bureaucracy", "category": "Politics & Governance", "definition": "A system of government in which most of the important decisions are taken by state officials.", "collocations": ["government bureaucracy", "excessive bureaucracy"], "example": "Businesses often complain about red tape and bureaucracy.", "masteryLevel": 3},
    {"id": "v27", "word": "Legislation", "category": "Politics & Governance", "definition": "Laws, considered collectively.", "collocations": ["new legislation", "introduce legislation"], "example": "The government introduced new legislation on housing.", "masteryLevel": 3},
    {"id": "v28", "word": "Constituent", "category": "Politics & Governance", "definition": "A member of a constituency who elects a representative.", "collocations": ["loyal constituent", "local constituent"], "example": "He was meeting with several of his constituents.", "masteryLevel": 2},
    {"id": "v29", "word": "Sovereignty", "category": "Politics & Governance", "definition": "The authority of a state to govern itself.", "collocations": ["national sovereignty", "territorial sovereignty"], "example": "The nation is protective of its sovereignty.", "masteryLevel": 1},
    {"id": "v30", "word": "Coalition", "category": "Politics & Governance", "definition": "An alliance for combined action.", "collocations": ["ruling coalition", "coalition government"], "example": "The two parties formed a coalition to govern.", "masteryLevel": 3},
    {"id": "v31", "word": "Censorship", "category": "Media & Communication", "definition": "The suppression of speech, public communication, or other information.", "collocations": ["government censorship", "internet censorship"], "example": "Censorship restricts the flow of information.", "masteryLevel": 3},
    {"id": "v32", "word": "Publicity", "category": "Media & Communication", "definition": "Notice or attention given to someone or something by the media.", "collocations": ["wide publicity", "publicity stunt"], "example": "The event received a lot of publicity.", "masteryLevel": 4},
    {"id": "v33", "word": "Convey", "category": "Media & Communication", "definition": "Communicate (a message or information).", "collocations": ["convey a message", "convey information"], "example": "It was hard to convey the true meaning of the text.", "masteryLevel": 4},
    {"id": "v34", "word": "Media-savvy", "category": "Media & Communication", "definition": "Having a good understanding of the media.", "collocations": ["media-savvy politician", "media-savvy youth"], "example": "Modern teenagers are extremely media-savvy.", "masteryLevel": 3},
    {"id": "v35", "word": "Misinformation", "category": "Media & Communication", "definition": "False or inaccurate information.", "collocations": ["spread misinformation", "combat misinformation"], "example": "Social media can be a breeding ground for misinformation.", "masteryLevel": 4},
    {"id": "v36", "word": "Narrative", "category": "Media & Communication", "definition": "A spoken or written account of connected events; a story.", "collocations": ["compelling narrative", "control the narrative"], "example": "They tried to control the political narrative.", "masteryLevel": 3},
    {"id": "v37", "word": "Inflation", "category": "Economics & Finance", "definition": "A general increase in prices and fall in the purchasing value of money.", "collocations": ["high inflation", "rate of inflation"], "example": "Inflation hit a 10-year high last month.", "masteryLevel": 4},
    {"id": "v38", "word": "Fiscal", "category": "Economics & Finance", "definition": "Relating to government revenue, especially taxes.", "collocations": ["fiscal policy", "fiscal year"], "example": "The government announced new fiscal measures.", "masteryLevel": 2},
    {"id": "v39", "word": "Prosperity", "category": "Economics & Finance", "definition": "The state of being prosperous.", "collocations": ["economic prosperity", "shared prosperity"], "example": "The country enjoyed a period of great prosperity.", "masteryLevel": 3},
    {"id": "v40", "word": "Recession", "category": "Economics & Finance", "definition": "A period of temporary economic decline.", "collocations": ["deep recession", "economic recession"], "example": "The country is sliding into a recession.", "masteryLevel": 4},
    {"id": "v41", "word": "Commodity", "category": "Economics & Finance", "definition": "A raw material or primary agricultural product that can be bought and sold.", "collocations": ["basic commodity", "global commodity"], "example": "Oil is a vital global commodity.", "masteryLevel": 3},
    {"id": "v42", "word": "Asset", "category": "Economics & Finance", "definition": "A useful or valuable thing or person.", "collocations": ["financial asset", "valuable asset"], "example": "The company's assets are worth millions.", "masteryLevel": 4},
    {"id": "v43", "word": "Urbanization", "category": "Urban Development", "definition": "The process of making an area more urban.", "collocations": ["rapid urbanization", "increasing urbanization"], "example": "Urbanization is changing the landscape of the country.", "masteryLevel": 4},
    {"id": "v44", "word": "Infrastructure", "category": "Urban Development", "definition": "The basic physical and organizational structures needed for the operation of a society.", "collocations": ["aging infrastructure", "transport infrastructure"], "example": "The city needs to invest in its infrastructure.", "masteryLevel": 3},
    {"id": "v45", "word": "Congestion", "category": "Urban Development", "definition": "The state of being congested.", "collocations": ["traffic congestion", "heavy congestion"], "example": "Traffic congestion is a major problem in big cities.", "masteryLevel": 4},
    {"id": "v46", "word": "Sustainability", "category": "Urban Development", "definition": "The ability to be maintained at a certain rate or level.", "collocations": ["environmental sustainability", "long-term sustainability"], "example": "Sustainability is at the heart of the new project.", "masteryLevel": 4},
    {"id": "v47", "word": "Metropolis", "category": "Urban Development", "definition": "The capital or chief city of a country or region.", "collocations": ["bustling metropolis", "global metropolis"], "example": "New York is a true global metropolis.", "masteryLevel": 3},
    {"id": "v48", "word": "Gentrification", "category": "Urban Development", "definition": "The process of renovating and improving a house or district.", "collocations": ["rapid gentrification", "neighborhood gentrification"], "example": "Gentrification has its pros and cons.", "masteryLevel": 2},
    {"id": "v49", "word": "Multiculturalism", "category": "Social Life & Culture", "definition": "The presence of, or support for the presence of, several distinct cultural or ethnic groups within a society.", "collocations": ["embrace multiculturalism", "policy of multiculturalism"], "example": "The city is a model of multiculturalism.", "masteryLevel": 3},
    {"id": "v50", "word": "Tradition", "category": "Social Life & Culture", "definition": "The transmission of customs or beliefs from generation to generation.", "collocations": ["ancient tradition", "local tradition"], "example": "It is a tradition to exchange gifts at Christmas.", "masteryLevel": 4},
    {"id": "v51", "word": "Cohesion", "category": "Social Life & Culture", "definition": "The action or fact of forming a united whole.", "collocations": ["social cohesion", "community cohesion"], "example": "The government aim is to promote social cohesion.", "masteryLevel": 2},
    {"id": "v52", "word": "Stereotype", "category": "Social Life & Culture", "definition": "A widely held but fixed and oversimplified image or idea of a particular type of person or thing.", "collocations": ["cultural stereotype", "defy stereotypes"], "example": "She doesn't fit the traditional stereotype.", "masteryLevel": 4},
    {"id": "v53", "word": "Linguistics", "category": "Social Life & Culture", "definition": "The scientific study of language and its structure.", "collocations": ["historical linguistics", "applied linguistics"], "example": "He is a professor of linguistics.", "masteryLevel": 1},
    {"id": "v54", "word": "Heritage", "category": "Social Life & Culture", "definition": "Property that is or may be inherited; an inheritance.", "collocations": ["cultural heritage", "world heritage"], "example": "We must protect our natural heritage.", "masteryLevel": 3},
    {"id": "v55", "word": "Biodiversity", "category": "Environment", "definition": "The variety of plant and animal life in the world or in a particular habitat.", "collocations": ["rich biodiversity", "loss of biodiversity"], "example": "The rainforest is known for its incredible biodiversity.", "masteryLevel": 2},
    {"id": "v56", "word": "Conservation", "category": "Environment", "definition": "Prevention of wasteful use of a resource.", "collocations": ["energy conservation", "wildlife conservation"], "example": "Conservation of water is essential in dry areas.", "masteryLevel": 4},
    {"id": "v57", "word": "Pollution", "category": "Environment", "definition": "The presence in or introduction into the environment of a substance or thing that has harmful or poisonous effects.", "collocations": ["air pollution", "water pollution"], "example": "Pollution is a threat to the ecosystem.", "masteryLevel": 4},
    {"id": "v58", "word": "Habitat", "category": "Environment", "definition": "The natural home or environment of an animal, plant, or other organism.", "collocations": ["natural habitat", "destroy habitat"], "example": "The panda is losing its natural habitat.", "masteryLevel": 4},
    {"id": "v59", "word": "Degradation", "category": "Environment", "definition": "The condition or process of degrading or being degraded.", "collocations": ["environmental degradation", "land degradation"], "example": "The plan aims to stop soil degradation.", "masteryLevel": 1},
    {"id": "v60", "word": "Renewable", "category": "Environment", "definition": "Not depleted when used.", "collocations": ["renewable energy", "renewable resource"], "example": "We need to move toward renewable energy sources.", "masteryLevel": 4},
]

MOCK_TESTS: list[dict[str, Any]] = [
    {"id": "m1", "number": 1, "dateTaken": "2026-05-10", "overallBand": 6.5, "scores": {"L": 7.0, "R": 6.5, "W": 6.0, "S": 6.5}, "status": "attempted"},
    {"id": "m2", "number": 2, "dateTaken": "2026-05-18", "overallBand": 6.5, "scores": {"L": 6.5, "R": 7.0, "W": 6.0, "S": 7.0}, "status": "attempted"},
    {"id": "m3", "number": 3, "dateTaken": None, "overallBand": None, "scores": None, "status": "not-attempted"},
    {"id": "m4", "number": 4, "dateTaken": None, "overallBand": None, "scores": None, "status": "not-attempted"},
    {"id": "m5", "number": 5, "dateTaken": None, "overallBand": None, "scores": None, "status": "not-attempted"},
    {"id": "m6", "number": 6, "dateTaken": None, "overallBand": None, "scores": None, "status": "not-attempted"},
]

DASHBOARD: dict[str, Any] = {
    "currentBand": 6.5,
    "targetBand": 7.5,
    "streak": 12,
    "practiceTimeHours": 47.5,
    "skillProficiency": [
        {"skill": "Listening", "current": 7.0, "sub": "Detail recognition improved by 12%"},
        {"skill": "Reading", "current": 6.5, "sub": "Skimming speed needs focus"},
        {"skill": "Writing", "current": 6.0, "sub": "Task 2 structure refined"},
        {"skill": "Speaking", "current": 6.5, "sub": "Fluency score at 7.0"},
    ],
    "errorLog": [
        {"id": "e1", "questionId": "p1-q5", "skill": "R", "errorType": "Careless Mistake", "date": "2026-05-24"},
        {"id": "e2", "questionId": "p2-q3", "skill": "L", "errorType": "Spelling", "date": "2026-05-23"},
        {"id": "e3", "questionId": "p8-q1", "skill": "W", "errorType": "Grammar", "date": "2026-05-22"},
    ],
    "recentSessions": [
        {"id": "s1", "type": "Practice Questions", "duration": "45m", "date": "2026-05-24"},
        {"id": "s2", "type": "Video Lecture", "duration": "15m", "date": "2026-05-24"},
        {"id": "s3", "type": "Vocabulary Review", "duration": "20m", "date": "2026-05-23"},
    ],
    "practiceSchedule": [
        {"id": "sc1", "day": "Monday", "task": "Reading Practice (Matching Headings)", "completed": True},
        {"id": "sc2", "day": "Tuesday", "task": "Listening Section 4 Practice", "completed": True},
        {"id": "sc3", "day": "Wednesday", "task": "Writing Task 2 Essay", "completed": False},
        {"id": "sc4", "day": "Thursday", "task": "Speaking Mock with AI", "completed": False},
        {"id": "sc5", "day": "Friday", "task": "Mock Test 3", "completed": False},
    ],
}

STUDY_PLAN: dict[str, Any] = {
    "tier": "1-Month Balanced",
    "startDate": "2026-05-01",
    "examDate": "2026-06-01",
    "todayTasks": [
        {"id": "t-1", "title": "Complete Reading Passage 3", "feature": "PRACTICE", "estimatedTime": "20m", "isPrimary": True},
        {"id": "t-2", "title": "Mastering Multiple Choice", "feature": "VIDEO", "estimatedTime": "15m", "isPrimary": False},
        {"id": "t-3", "title": "Technology Vocabulary Review", "feature": "VOCAB", "estimatedTime": "10m", "isPrimary": True},
        {"id": "t-4", "title": "Mock Test 2 Review", "feature": "MOCK", "estimatedTime": "45m", "isPrimary": False},
    ],
    "days": [
        {
            "dayNumber": 25,
            "tasks": [
                {"id": "t1", "title": "Complete Reading Passage 3", "skill": "R", "duration": "20m", "completed": True},
                {"id": "t2", "title": "Review Academic Vocabulary", "skill": "General", "duration": "15m", "completed": False},
                {"id": "t3", "title": "Practice Speaking Part 2", "skill": "S", "duration": "10m", "completed": False},
            ],
        }
    ],
}

IELTS_ESSAYS: list[dict[str, str]] = [
    {"id": "T2-1", "title": "The Impact of Social Media on Modern Communication", "type": "Task 2", "content": "Social media has fundamentally transformed the way humans interact and communicate in the twenty-first century. While it has bridged geographical divides and allowed for instantaneous exchange of ideas, some critics argue that it has simultaneously eroded the depth and quality of personal relationships. In this essay, I will discuss both the positive and negative implications of this digital shift, ultimately arguing that the benefits of connectivity outweigh the drawbacks of social isolation."},
    {"id": "T2-2", "title": "Economic Growth vs. Environmental Protection", "type": "Task 2", "content": "The tension between economic development and environmental sustainability remains one of the most pressing challenges of our time. Many developing nations prioritize industrial expansion to alleviate poverty, often at the expense of ecological health. Conversely, developed countries advocate for stringent regulations to combat climate change. This essay will examine whether it is possible to achieve a balance where economic prosperity does not necessitate the destruction of our natural world."},
    {"id": "T2-3", "title": "The Role of Government in Public Healthcare", "type": "Task 2", "content": "The question of whether healthcare should be a universal right provided by the state or a private service determined by market forces is a subject of intense debate. Proponents of public healthcare argue that a nations health is a collective responsibility that ensures equity for all citizens. On the other hand, advocates of privatization believe that competition leads to better quality and innovation. This essay will explore the various models of healthcare delivery and their impact on societal well-being."},
    {"id": "T2-4", "title": "Online Learning vs. Traditional Classrooms", "type": "Task 2", "content": "The rapid advancement of digital technology has ushered in a new era of education, characterized by the rise of online learning platforms. Many students now prefer the flexibility and accessibility of virtual classrooms over the traditional brick-and-mortar experience. However, skeptics maintain that the lack of physical interaction and the potential for distractions can hinder the learning process. This essay will compare both methods and argue that a hybrid approach is the most effective solution for future education."},
    {"id": "T1-1", "title": "Data Analysis: Global Smartphone Adoption 2010-2025", "type": "Task 1", "content": "The provided data illustrates the exponential growth in smartphone adoption across different continents between 2010 and 2025. In the early stages, North America and Europe led the market, accounting for over sixty percent of total users. However, by 2020, Asian markets saw a dramatic surge, surpassing all other regions combined. This trend is expected to continue as infrastructure improves in developing nations, leading to near-total global connectivity by the end of the forecast period."},
    {"id": "T1-2", "title": "Process Diagram: The Hydrological Cycle", "type": "Task 1", "content": "The hydrological cycle, more commonly known as the water cycle, describes the continuous movement of water on, above, and below the surface of the Earth. The process begins with evaporation, where solar energy heats water in oceans and lakes, turning it into vapor. This vapor then rises into the atmosphere, where it cools and condenses into clouds. Finally, precipitation occurs in the form of rain or snow, returning the water to the Earths surface to begin the cycle anew."},
]

ACHIEVEMENTS: list[dict[str, str]] = [
    {"label": "Vocabulary Master", "date": "2 days ago", "type": "VOCAB"},
    {"label": "Band 8 Reading", "date": "Weekly Mock", "type": "MOCK"},
    {"label": "15 Day Streak", "date": "Daily Goal", "type": "STREAK"},
]


def today_iso() -> str:
    return date.today().isoformat()
