from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import motor.motor_asyncio
import random
import string
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# MongoDB client setup
MONGO_DETAILS = "mongodb+srv://dsakethsurya:saketh1234@merncluster.c3k9g.mongodb.net/?retryWrites=true&w=majority&appName=MernCluster"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client.Enhance42 # case-sensitive name, TODO: change db name to lowercase

print("Connected to DB:", db)

responses_collection = db.get_collection("responses")
question_papers_collection = db.get_collection("question_papers")
exams_collection = db.get_collection("exams")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#function to generate a 6-character unique question ID
# Function to generate a 6-character unique exam ID
def generate_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


# Sample question paper document

# question_paper_doc = {
#         "user_info": [
#             "Name",
#             "Roll Number",
#             "Branch",
#             "College Name",
#             "Email",
#             "Phone Number"
#         ],
#         "sms1": "Your Acct XX306 debited with 2000.0 on Jul14,2024 & A/c XX169 credited. TXN ID-1394248240. Call 18005700, for any dispute -SBI",
#         "sms2": "PNR:4131147209,TRN:12728,DOJ:28-07-24,3A,HYB-VSKP,DP:17:05,Boarding at HYD only,K PAWAN KALYAN,B1 71,Fare:2190,SC Fee:23.6+PG CHGS."
#     }


# function to create a html form for the question paper data
def generate_form(exam_id, question_paper):
    print("Question Paper:", question_paper)
    # TODO: make this cleaner
    # user_details_html = ''.join([f'''<div class="form-group">
    #       <label for="{info.lower().replace(' ', '_')}">{info}</label>
    #       <input type="text" id="{info.lower().replace(' ', '_')}" name="{info.lower().replace(' ', '_')}" required>
    #     </div>''' for info in question_paper['user_info']])

    # print("User Details HTML:", user_details_html)
    
    #   <textarea id="answer1" name="answer1" rows="4" required></textarea>   
    # <div class="form-group">
    #       <label for="question2">Question 2</label>
    #       <p>A customer received the following SMS on his mobile:</p>
    #       <p>{question_paper['sms2']}</p>
    #       <p>Use the following space to write code (Print statement) that generates the above SMS:</p>
    #       <textarea id="answer2" name="answer2" rows="4" required></textarea>
    #     </div>
    # Below is the script that is removed
    # const q1TextField = document.getElementById('answer1');
    #        const q2TextField = document.getElementById('answer2');

    #         let q1Actions = []; // Array to store actions
    #         let q1PreviousText = ''; // To track previous text

    #         // Capture every keystroke and store in actions
    #         q1TextField.addEventListener('input', function(event) {{
    #             const currentText = q1TextField.value;
    #             const action = {{
    #                 text: currentText,
    #                 position: getModifiedPosition(q1PreviousText, currentText),
    #                 time: Date.now()
    #             }};
    #             q1Actions.push(action);
    #             q1PreviousText = currentText;
    #         }});

    #         let q2Actions = []; // Array to store actions
    #         let q2PreviousText = ''; // To track previous text

    #         // Capture every keystroke and store in actions
    #         q2TextField.addEventListener('input', function(event) {{
    #             const currentText = q2TextField.value;
    #             const action = {{
    #                 text: currentText,
    #                 position: getModifiedPosition(q2PreviousText, currentText),
    #                 time: Date.now()
    #             }};
    #             q2Actions.push(action);
    #             q2PreviousText = currentText;
    #         }});

    #         function getModifiedPosition(oldText, newText) {{
    #             let pos = 0;
    #             while (pos < oldText.length && pos < newText.length && oldText[pos] === newText[pos]) {{
    #                 pos++;
    #             }}
    #             return pos;
    #         }}
# jsonData['q1_actions'] = q1Actions;
#             jsonData['q2_actions'] = q2Actions;

        #   <p>A customer received the following SMS on his mobile:</p>
    # const formData = new FormData(form);
    # formData.forEach((value, key) => {{
    #         jsonData[key] = value;
    #       }}); 
    #  const form = document.getElementById('questionPaperForm');

    form_html = f'''
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://unpkg.com/monaco-editor/min/vs/loader.js"></script>
      <title>Question Paper Form</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap">
      <style>
        body {{
          font-family: 'Roboto', sans-serif;
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }}
        h1 {{
          text-align: center;
        }}
        .form-group {{
          margin-bottom: 15px;
        }}
        label {{
          font-weight: bold;
          display: block;
          margin-bottom: 5px;
        }}
        button {{
          display: block;
          width: 100%;
          padding: 10px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }}
        button:hover {{
          background-color: #45a049;
        }}
      </style>
    </head>
    <body>
      <h1>Question Paper Form</h1>
      <form id="questionPaperForm">
        Saketh
        <div class="form-group">
          <label for="editor">Question 1</label>
          <p>{question_paper['question_text']}</p>
          <p>Use the following space to write code (Print statement) that generates the above SMS:</p>
          <div id="editor"  style="margin-top: 20px; width: 100%; height: calc(18 * 1.5em); border: 1px solid #ccc;"></div>
        </div>
        <button type="button" onclick="submitForm()">Submit Answers</button>
      </form>
      <script>
           let editor;
           const editorChanges = [];
           
           require.config({{ paths: {{ vs: "https://unpkg.com/monaco-editor/min/vs" }} }});
           require(["vs/editor/editor.main"], function () {{
                editor = monaco.editor.create(document.getElementById("editor"), {{
                value: "// Write your code here",
                language: "c",
                readOnly: false
                }});
                
                console.log("trying to trigger change event");
                    // Listen to content changes
                    editor.onDidChangeModelContent((event) => {{
                    const currentContent = editor.getValue();
                        editorChanges.push({{
                        timestamp: new Date().toISOString(),
                        content: currentContent,
                        }});
                    console.log("Change recorded:", currentContent);
                    }});
            }});
            
            
        async function submitForm() {{
           const editorContent = editor.getValue();
           const jsonData = {{ code: editorContent, editorChanges: editorChanges }};           
           console.log(jsonData);
          const response = await fetch(`/exam/{exam_id}`, {{
            method: 'POST',
            headers: {{
              'Content-Type': 'application/json'
            }},
            body: JSON.stringify(jsonData)
          }});
          const result = await response.json();
          console.log(result);
          alert(result.message);
        }}
      </script>
    </body>
    </html>
    '''
    return form_html

#function to create a html form for the question paper data (Student form)
@app.get("/exam", response_class=HTMLResponse)
async def home():
    html_form = f'''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exam Portal</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 20px;
            }}
            #examId, #submitBtn {{
                display: block;
                margin-bottom: 10px;
                padding: 10px;
                width: 300px;
            }}
        </style>
    </head>
    <body>
        <h1>Exam Portal</h1>
        <input type="text" id="examId" name="examId" placeholder="Enter Exam ID" required>
        <button id="submitBtn">Start Exam</button>
        <script>
            document.getElementById('submitBtn').addEventListener('click', function() {{
                const examId = document.getElementById('examId').value; 
                window.location.href = `/exam/${{examId}}`;
            }});
        </script>
    </body>
    </html>
    '''
    return HTMLResponse(content=html_form)


#function to create a html form for the question paper data (Teacher form)
@app.get("/", response_class=HTMLResponse)
async def home():
    question_id = generate_id()
    exam_id = generate_id()
    
    html_form = f'''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exam Portal</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 20px;
            }}
            #examId, #submitBtn {{
                display: block;
                margin-bottom: 10px;
                padding: 10px;
                width: 300px;
            }}
        </style>
    </head>
    <body>
        <h1>Exam Portal</h1>
        <h2>Teacher Form</h2>
        <h3>Enter the details of the exam</h3>
        <p>1. Enter the question</p>
        <input type="text" id="questionId" name="questionId" placeholder="Enter the question -" required>
        <p>2. Enter the test case to verify</p>
        <input type="text" id="testCaseInput" name="testCaseInput" placeholder="Enter the test case input" required>
        <input type="text" id="testCaseOutput" name="testCaseOutput" placeholder="Enter the test case output" required>
        <button id="submitBtn">Submit</button>
        <script>
            document.getElementById('submitBtn').addEventListener('click', function() {{
                const question_text = document.getElementById('questionId').value;
                const testCaseInput = document.getElementById('testCaseInput').value;
                const testCaseOutput = document.getElementById('testCaseOutput').value;
                const question_id = "{question_id}";
                const exam_id = "{exam_id}";
                const question_paper = {{
                    "question_id": question_id,
                    "question_text": question_text,
                    "test_cases": [{{
                        "input": testCaseInput,
                        "output": testCaseOutput
                    }}]
                }};
                const exam_data = {{
                    "_id": exam_id,
                    "question_paper_id": question_id,
                    "accept_responses": true,
                    "message": "The exam is currently accepting responses."
                }};
                
                fetch('/', {{
                    method: 'POST',
                    headers: {{
                        'Content-Type': 'application/json'
                    }},
                    body: JSON.stringify({{question_paper, exam_data}})
                }})
                .then(response => response.json())
                .then(data => {{
                    console.log(data);
                    if(data.message === "Exam created successfully!") {{
                        alert("Exam created successfully! Exam ID: " + data.exam_id);
                    }}
                }})
                .catch(error => {{
                    console.error('Error:', error);
                }});
                
            }});
        </script>
    </body>
    </html>
    '''
    return HTMLResponse(content=html_form)


@app.post('/')
async def create_exam(question_paper: object , exam_data: object ):
    print(question_paper)
    print(exam_data)
    # save the question paper to the database
    result = await question_papers_collection.insert_one(question_paper)
    print("Question Paper ID:", result.inserted_id)
    #save the exam data to the database
    result = await exams_collection.insert_one(exam_data)
    print("Exam ID:", result.inserted_id)
    return {"message": "Exam created successfully!", "exam_id": str(result.inserted_id)}

# Endpoint to get the question paper for a given exam ID
# GET exam/<exam id>
@app.get("/exam/{exam_id}", response_class=HTMLResponse)
async def get_question_paper(exam_id: str):
    print("Exam ID:", exam_id)
    # exam_doc = await exams_collection.find().to_list(100) #find_one({"exam_id": exam_id})
    exam_doc = await exams_collection.find_one({"_id": exam_id})
    print("Exam Doc:", exam_doc)
    if not exam_doc:
        # generate HTML response using the error message
        return HTMLResponse(content=f"<h1>Exam ID {exam_id} not found!</h1>")

    # if accept_responses is False, return a message from exam_doc["message"]
    if not exam_doc["accept_responses"]:
        return HTMLResponse(content=f"<h1>{exam_doc['message']}</h1>")
    
    # generate the form using the question paper data
    question_paper_id = exam_doc["question_paper_id"]
    question_paper = await question_papers_collection.find_one({"question_id": question_paper_id})
    html_form = generate_form(exam_id, question_paper)
    return HTMLResponse(content=html_form)



# Endpoint to submit the answers for a given exam ID as a single JSON object
# POST exam/<exam id>
@app.post("/exam/{exam_id}")
async def submit_answers(exam_id: str, jsonData: dict):
    print("Exam ID:", exam_id)
    print("Data:", jsonData)
    # check if the exam ID exists
    exam_doc = await exams_collection.find_one({"_id": exam_id})
    if not exam_doc:
        return {"message": f"Exam ID {exam_id} not found!"}

    # check if the exam is still accepting responses
    if not exam_doc["accept_responses"]:
        return {"message": exam_doc["message"]}
    
    # save the responses to the database
    responses_doc = {
        "exam_id": exam_id,
        "finalCode": jsonData['code'],
        "allChanges": jsonData['editorChanges']
    }
    result = await responses_collection.insert_one(responses_doc)
    print("Response ID:", result.inserted_id)
    return {"message": "Your response has been recorded successfully!"}


# Endpoint to get the result for a given exam ID
# GET responses/<exam id>
@app.get("/responses/{exam_id}")
async def get_responses(exam_id: str):
    # get details from responses collection for the given exam ID
    details = await responses_collection.find({"exam_id": exam_id}).to_list(100)
    for detail in details:
        detail["_id"] = str(detail["_id"])
    return details


# GET /responses/<exam id>/<response id>
@app.get("/responses/{exam_id}/{response_id}", response_class=HTMLResponse)
async def get_response(exam_id: str, response_id: str):
    # get details from responses collection for the given exam ID and response ID
    # TODO: make readable

    response = await responses_collection.find_one({"exam_id": exam_id, "_id": ObjectId(response_id)}, {'_id':0})
    html_response = generate_answer_replay_page(response)
    return HTMLResponse(content=html_response)


# Endpoint to get the result for a given exam ID
# GET exam/<exam id>/result
@app.get("/exam/{exam_id}/result")
async def get_result(exam_id: str):
    # get details from results collection for the given exam ID
    # get details from responses collection for the given exam ID 
    pass


# Endpoint to process repsonses for a given exam ID and generate the result in 'results' collection
# POST exam/<exam id>/evaluate
@app.post("/exam/{exam_id}/evaluate")
async def evaluate_responses(exam_id: str):
    pass


def generate_answer_replay_page(response):
    title = "replaying the answers"
    editor_data = response['allChanges']
    print(editor_data)
    
    html_content = f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://unpkg.com/monaco-editor/min/vs/loader.js"></script>
    <title>{title}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
        }}
        #textField, #submitBtn {{
            display: block;
            margin-bottom: 10px;
            padding: 10px;
            width: 300px;
        }}
        #textField {{
            height: 100px; /* Adjust height to fit multiple lines */
            resize: none; /* Prevents resizing */
            overflow-wrap: break-word; /* Ensures long words break and wrap */
            white-space: pre-wrap; /* Ensures Enter key creates a new line */
        }}
        #replayArea {{
            margin-top: 20px;
            font-size: 18px;
            padding: 10px;
            border: 1px solid #ccc;
            min-height: 100px; /* Adjust height for multiple lines */
            width: 300px;
            white-space: pre-wrap; /* Ensures new lines and spaces are preserved in replay */
            position: relative;
        }}
        .blinking-cursor {{
            display: inline-block;
            width: 2px;
            background-color: black;
            animation: blink 0.7s steps(1) infinite;
            vertical-align: text-bottom;
        }}
        @keyframes blink {{
            50% {{ opacity: 0; }}
        }}
        .highlight {{
            background-color: yellow;
            transition: background-color 0.5s ease;
        }}
    </style>
</head>
<body>
    <h1>Answer - 1</h1>
    <button id="replayButton" style="display: block; margin: 20px auto;">Replay</button>
    <div id="timestamp" style="display: block; margin: 20px auto;"></div>
    <div id="editor" style="margin-top: 20px; width: 100%; height: 500px; border: 1px solid #ccc; display: none;"></div>


    <script>
        require.config({{ paths: {{ vs: "https://unpkg.com/monaco-editor/min/vs" }} }});
        const timestampElement = document.getElementById('timestamp');
        
         document.getElementById('replayButton').addEventListener('click', function () {{
                // Display the editor
                const editorElement = document.getElementById('editor');
                editorElement.style.display = 'block';
             
                require(["vs/editor/editor.main"], function () {{
                    const editor = monaco.editor.create(editorElement, {{
                        value: "",
                        language: "c", // Change language as needed
                        theme: "vs-dark",
                        readOnly: false // Allow replay to modify content
                    }});

                    // Simulate typing actions
                    const data = [{editor_data}];
                    simulateTyping(editor, data);
                }});
            }});
            
            async function simulateTyping(editor, data) {{
                for (let i = 0; i < data.length; i++) {{
                    const change = data[i];
                    timestampElement.textContent = change.timestamp;
                    await replayChanges(change, editor);
                }}
            }}
            
         // Function to simulate typing in the editor
          function replayChanges(change, editor) {{
                 const replaySpeed = 500; // Delay between applying changes (in ms)
                 let index = 0;

                function applyChange() {{
                     if (index < change.length) {{
                        editor.setValue(change[index].content); // Set content for the current change
                        index++;
                        setTimeout(applyChange, replaySpeed); // Schedule the next change
                    }}
                }}

                applyChange(); // Start replaying changes
          }}
    </script>
</body>
</html>
    '''
    return html_content

    # name = response['data']['name']
    # answer1 = response['data']['answer1']
    # answer2 = response['data']['answer2']
    # q1_actions = response['data']['q1_actions']
    # q2_actions = response['data']['q2_actions']
    
    #Below removed
    # <h1>Answer - 2</h1>
    # <p>{answer2}</p>
    # <h1>Student: {name}</h1>
    # <h1>Answer - 1</h1>
    # <p>{answer1}</p>
    # <button id="replayQ2">Replay</button>
    # <div id="replayArea2"></div>

    #  const replayQ2 = document.getElementById('replayQ2');
    # const replayArea2 = document.getElementById('replayArea2');
    #     const actions1 = {q1_actions};
    #     const actions2 = {q2_actions};
    
    # replayQ1.addEventListener('click', function() {{
    #         // Start replay
    #         replayTyping(actions1, replayArea1, 0);
    #     }});

    #     replayQ2.addEventListener('click', function() {{
    #         // Start replay
    #         replayTyping(actions2, replayArea2, 0);
    #     }});


    #     function replayTyping(actions, replayArea, i) {{
    #         const typingSpeed = 150; // Speed of replay in milliseconds
    #         // Create the cursor element
    #         let cursor = document.createElement('span');
    #         cursor.classList.add('blinking-cursor');
    #         replayArea.appendChild(cursor);

    #             if (i < actions.length) {{
    #                 replayArea.innerHTML = ''; // Clear previous replay
    #                 const action = actions[i];
    #                 replayArea.innerHTML = ''; // Clear the replay area for new content

    #                 // Split text into individual characters
    #                 let currentText = action.text.split('');
    #                 currentText.forEach((char, index) => {{
    #                     let span = document.createElement('span');
    #                     span.textContent = char;
    #                     if (index === action.position) {{
    #                         // Highlight the modified character
    #                         span.classList.add('highlight');
    #                         setTimeout(() => {{
    #                             span.classList.remove('highlight');
    #                         }}, 500); // Remove highlight after 500ms
    #                     }}
    #                     replayArea.appendChild(span);
    #                 }});

    #                 // Move the cursor to the end of the current text
    #                 replayArea.appendChild(cursor);

    #                 setTimeout(() => replayTyping(actions, replayArea, i+1), typingSpeed);
    #             }}
    #         }}

    
#  const replayQ1 = document.getElementById('replayQ1');
#         const replayArea1 = document.getElementById('replayArea1');