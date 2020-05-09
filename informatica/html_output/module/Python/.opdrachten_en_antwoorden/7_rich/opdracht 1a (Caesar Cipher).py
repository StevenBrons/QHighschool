# a:
message = input("Het te versleutelen bericht: ")
key = int(input("Hoeveel ascii-plaatsen de karakters worden verschoven: "))

encipheredText = ""

for i in message:
    chrValue = ord(i)
    newValue = chrValue + key
    encipheredText += chr(newValue)

print(encipheredText)
