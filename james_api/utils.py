# This code is for v1 of the openai package: pypi.org/project/openai
from openai import OpenAI
import difflib
client = OpenAI(
  api_key= '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',
)

test_doc_content = "TA Meeting: November 16th\nAttendees\nRayan Isran, Mathieu Geoffroy, David Breton, Theo Ghanem, Sehr Moosabhoy, Ryan Reszetnik, Sabrina Mansour\nDesired outcomes:\nVerify deliverable content with Rayan\nUpdate Ryan on our progress\nFlag any problems with our design\nAgenda\nShow updated plans and task list.\nVerify that the content of our data input testing document is correct.\nVerify that the content of our design document is correct.\nGive a short demo of our progress so far.\nFlag potential problems:\nCan ease of use be defined?\nHow to address shortage of pieces.\nNotes\nShow updated plans and task list.\nGantt chart is okay if we submit as a pdf\nOur time breakdown is good for now - won’t be exact\nVerify that the content of our data input testing document is correct.\nLooking good, expected and real are good indicators\nMost important thing is readability\nVerify that the content of our design document is correct.\nLooking good :)\nDon’t need to be more detailed in out description\nSubsystems at a high level is good\nIntegration is quite important\nAerial view of diagram and drawn are good as long as they are annotated\nGive a short demo of our progress so far.\nStalled out motor :( \nCould plot the actual positions sent to the motor and make sure info sent to motor is correct\nBad cable :( very sad\nCould draw less power by setting dps limits\nCould set a fixed speed that is slow enough to not draw enough power but will still only take within 3 min\nCable manage near the end \nFlag potential problems:\nCan ease of use be defined?\nWas answered by Katrina’s post\nHow to address shortage of pieces.\nAlso addressed by our optimization\nFor design presentation\nMention what we have tested\nWhat are the issues\nCoherent story\nGo linearly\nCan send him the presentation to review\n\n\nAction Items\nNone.\n"
currentMeetingDialogueInput = "So can ease of use be defined? We define ease of use by the amount of time it takes to set up the puzzle, the amount of time it takes to solve the puzzle, and the amount of time it takes to reset the puzzle."

def adjustContent(content, dialogue):
  response = client.chat.completions.create(
    model = "gpt-4",
    messages = [
    {"role": "system", "content": f"""
    You will be provided with meeting notes and a piece of dialogue that was said during the meeting. Your role is to find the best place for it add it without changing the rest of the notes. These notes should be a summary of what is said into bullet points as if the person who said it wrote them themselves and not the verbatum words. If it is fully off topic, don't make any changes to the document. Awlays add notes to a new paragraph compared to what is already there and keep them short.
    """},
    {"role": "user", "content": content + "\n=====================\nHere is the dialogue that was said:\n" + dialogue},

    ],

    temperature = 0,
    max_tokens = 1024
  )

  chat_interpretation = dict(dict(dict(response)['choices'][0])['message'])['content']
    
  return chat_interpretation


def show_changes(old_text, new_text):
  d = difflib.Differ()
  diff = list(d.compare(old_text.splitlines(), new_text.splitlines()))

  line_position_array = []

  line_count = 0
  character_count = 0

  for line in diff:
    prev_line = diff[line_count-1]
    line_position = line_count-1
    while len(prev_line[2:].strip()) == 0:
      if line_position < 0:
         break
      prev_line = diff[line_position]
      line_position -= 1
    character_count += len(line)
    if line.startswith('+ '):  # Added line
        print(line_count, f"\033[92m{line}\033[0m")  # Print in green
        #remove the + and space
        if prev_line.startswith('+ '):
          prev = line_position_array.pop()
          line_position_array.append((line_count, character_count, prev[2]+"\n"+line[2:], prev[3]))
        elif prev_line.startswith('-'):
          if prev_line[2:] in line[2:]:
            #only add the new part
            line_position_array.append((line_count, character_count, line[2+len(prev_line[2:]):],prev_line[2:]))
        else:
          line_position_array.append((line_count, character_count, line[2:], prev_line))
    elif line.startswith('- '):  # Removed line
        print(line_count, f"\033[91m{line}\033[0m")  # Print in red
    elif line.startswith('? '):  # Info about lines (common in unified diffs)
        print(line_count, f"\033[94m{line}\033[0m")  # Print in blue
    else:
        print(line_count, line)
    line_count += 1


  return line_position_array


def run_adjustContent(content, dialogue):
  adjustedContent = adjustContent(content, dialogue)
  line_position_array = show_changes(content, adjustedContent)
  return line_position_array