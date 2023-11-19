from flask import Flask, request
from flask_cors import CORS  # Import the CORS module
from openai import OpenAI

client = OpenAI(
    api_key='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'
)
app = Flask(__name__)

CORS(app, methods=["GET", "POST", "OPTIONS"])

# Routing API calls

@app.route('/')
def index():
    return "hello World"

@app.route('/<name>')
def print_name(name):
    return 'hi, {}'.format(name)

@app.route('/get', methods=['GET'])
def handle_get():
    if request.method == 'GET':
        data = request.get_json()

        if data is not None: 
            
            # Getting necessary information for openai api
            existing_notes = data["doc_content"] 
            new_dialogue = data["dialogue"]

            print('Existing notes before diologue addition:\n\n {}'.format(existing_notes))
            print('Phrase that is being entered at the correct spot: \n\n {}'.format(new_dialogue))

            # Using the Openai API to sort new sentence into corerct category of notes

            updated_notes = adjustContent(existing_notes, new_dialogue)

            # Return modified notes modified with new information

            print('Notes after diologue addition:\n\n {}'.format(updated_notes))
            return 'Received GET data: {}'.format(updated_notes)
        
        else:
            print('No valid JSON data received in the GET request.')
            return 'No valid JSON data received in the GET request.'
    else:
            print('This endpoint only accepts GET requests.')
            return 'This endpoint only accepts GET requests.'


    return "File has been received"


# Function to sort new dialogue additions into the 

def adjustContent(content, dialogue):
  response = client.chat.completions.create(
    model = "gpt-4",
    messages = [
    {"role": "system", "content": f"""
    You will be provided with meeting notes:
    """},
    {"role": "user", "content": content},
    {"role": "system", "content": '''
     The following is a piece of dialogue that was said during the meeting find the best place for it add it.
     If there is already a subsection dedicated to this topic, add it there.
     You should return the full document with the new content added to it in a note format.
     Make sure that the same numbering and format is used.
     '''},
    {"role": "user", "content": dialogue}
    ],

    temperature = 0,
    max_tokens = 1024
  )

  chat_interpretation = dict(dict(dict(response)['choices'][0])['message'])['content']
    
  return chat_interpretation

if __name__ == '__main__':
    app.run()


