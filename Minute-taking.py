# This code is for v1 of the openai package: pypi.org/project/openai
from openai import OpenAI
client = OpenAI(
  api_key= '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',
)

# fileobj = open(r"Meeting1.txt", "r")
# meeting1 = fileobj.read()
# fileobj.close()

# fileobj = open(r"Meeting2.txt", "r")
# meeting2 = fileobj.read()
# fileobj.close()

def getSummary(meetingTranscript):
  print("Beginning to summarize meeting transcript...")
  response = client.chat.completions.create(
    model = "gpt-4",
    messages = [
        
      {"role": "system", "content": """
      
       You will be provided with meeting notes, and your task is to summarize the meeting as follows:

       -Speakers (who are the speakers in the conversation)
       -Identify subthemes of the conversation
       -Overall summary of discussion
       -Action items (what needs to be done and who is doing it) be as specific as possible
       -If applicable, a list of each person in the meeting and what they have worked on since the last meeting
       -If applicable, a list of topics that need to be discussed more fully in the next meeting.
          
       """},

      {"role": "user", "content": meetingTranscript}
        
    ],

    temperature = 0,
    max_tokens = 1024
  )

  chat_interpretation = dict(dict(dict(response)['choices'][0])['message'])['content']
    
  return chat_interpretation

def updateSummary(meetingSummary, overallTopics, currentMeetingDialouge):
  print("Beginning to update meeting summary...")
  response = client.chat.completions.create(
    model = "gpt-4",
    messages = [
    {"role": "system", "content": f"""
    You will be provided with meeting notes, and your task is to summarize the meeting as follows:
    

    """},
    {"role": "user", "content": meetingSummary},
    {"role": "system", "content": '''
     The following is a piece of dialogue that was said during the meeting find the best place for it add it.
     If there is already a subsection dedicated to this topic, add it there. If not, create a new subsection.
     You should return the full document with the new content added to it.
     '''},
    {"role": "user", "content": currentMeetingDialouge}
    ],

    temperature = 0,
    max_tokens = 1024
  )

  chat_interpretation = dict(dict(dict(response)['choices'][0])['message'])['content']
    
  return chat_interpretation

#summary_meeting1 = getSummary(meeting1)

currentMeetingDialogueInput = '''
Bob: Things are coming together smoothly. I've set up the server, and the database integration is almost complete. I've also started exploring APIs for environmental data.

Alice: That's great, Bob. Charlie, how about the machine learning model?

Charlie: I've made good progress too. I've trained a basic model for personalized suggestions. Still fine-tuning, but it's on track.

Alice: Excellent. Dave, how's the frontend shaping up?

Dave: The user interface is taking shape. I've focused on a clean design for now. I'll be ready for feedback soon.

Alice: By next week please fill in the survery I emailed you all. It will help us to better understand our users.'''

#summary_meeting2 = updateSummary(summary_meeting1, currentMeetingDialogueInput)






test_doc_content = "TA Meeting: November 16th\nAttendees\nRayan Isran, Mathieu Geoffroy, David Breton, Theo Ghanem, Sehr Moosabhoy, Ryan Reszetnik, Sabrina Mansour\nDesired outcomes:\nVerify deliverable content with Rayan\nUpdate Ryan on our progress\nFlag any problems with our design\nAgenda\nShow updated plans and task list.\nVerify that the content of our data input testing document is correct.\nVerify that the content of our design document is correct.\nGive a short demo of our progress so far.\nFlag potential problems:\nCan ease of use be defined?\nHow to address shortage of pieces.\nNotes\nShow updated plans and task list.\nGantt chart is okay if we submit as a pdf\nOur time breakdown is good for now - won’t be exact\nVerify that the content of our data input testing document is correct.\nLooking good, expected and real are good indicators\nMost important thing is readability\nVerify that the content of our design document is correct.\nLooking good :)\nDon’t need to be more detailed in out description\nSubsystems at a high level is good\nIntegration is quite important\nAerial view of diagram and drawn are good as long as they are annotated\nGive a short demo of our progress so far.\nStalled out motor :( \nCould plot the actual positions sent to the motor and make sure info sent to motor is correct\nBad cable :( very sad\nCould draw less power by setting dps limits\nCould set a fixed speed that is slow enough to not draw enough power but will still only take within 3 min\nCable manage near the end \nFlag potential problems:\nCan ease of use be defined?\nWas answered by Katrina’s post\nHow to address shortage of pieces.\nAlso addressed by our optimization\nFor design presentation\nMention what we have tested\nWhat are the issues\nCoherent story\nGo linearly\nCan send him the presentation to review\n\n\nAction Items\nNone.\n"
currentMeetingDialogueInput = "So can ease of use be defined? We define ease of use by the amount of time it takes to set up the puzzle, the amount of time it takes to solve the puzzle, and the amount of time it takes to reset the puzzle."



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
     You should return the full document with the new content added to it.
     Make sure that the same numbering and format is used.
     '''},
    {"role": "user", "content": dialogue}
    ],

    temperature = 0,
    max_tokens = 1024
  )

  chat_interpretation = dict(dict(dict(response)['choices'][0])['message'])['content']
    
  return chat_interpretation

adjustedContent = adjustContent(test_doc_content, currentMeetingDialogueInput)

import difflib

def show_changes(old_text, new_text):
  d = difflib.Differ()
  diff = list(d.compare(old_text.splitlines(), new_text.splitlines()))

  line_position_array = []

  i = 0
  for line in diff:
    if line.startswith('+ '):  # Added line
        print(i, f"\033[92m{line}\033[0m")  # Print in green
        line_position_array.append((i, line))
    elif line.startswith('- '):  # Removed line
        print(i, f"\033[91m{line}\033[0m")  # Print in red
    elif line.startswith('? '):  # Info about lines (common in unified diffs)
        print(i, f"\033[94m{line}\033[0m")  # Print in blue
    else:
        print(i, line)
    i += 1
  print(list(diff)[38])

  return line_position_array



show_changes(test_doc_content, adjustedContent)




