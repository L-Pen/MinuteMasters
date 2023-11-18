# This code is for v1 of the openai package: pypi.org/project/openai
from openai import OpenAI
client = OpenAI()

fileobj = open(r"c:\Users\James\OneDrive\Desktop\MinuteMasters\Meeting1.txt", "r")
meeting1 = fileobj.read()
fileobj.close()

fileobj = open(r"c:\Users\James\OneDrive\Desktop\MinuteMasters\Meeting2.txt", "r")
meeting2 = fileobj.read()
fileobj.close()


response = client.chat.completions.create(
  model = "gpt-4",
  messages = [
      
    {"role": "system", "content": """
     
     You will be provided with meeting notes, and your task is to summarize the meeting as follows:

     -Speakers (who are the speakers in the conversation)
     -Identify subthemes of the conversation
     -Overall summary of discussion
     -Action items (what needs to be done and who is doing it)
     -If applicable, a list of topics that need to be discussed more fully in the next meeting.
        
     """},

    {"role": "user", "content": meeting1}
      
  ],

  temperature = 0,
  max_tokens = 1024
)

chat_interpretation = dict(dict(dict(response)['choices'][0])['message'])['content']


print(chat_interpretation)


