import math

# b1:
message = input("Het te versleutelen bericht: ")
key = int(input("Hoeveel ascii-plaatsen de karakters worden verschoven: "))

encipheredText = ""

for i in message:
    chrValue = ord(i)
    totalValue = chrValue + key

    cycles = totalValue / 128
    cycFlr = math.floor(cycles)
    newValue = totalValue - cycFlr * 128

    encipheredText += chr(newValue)

print(encipheredText)


# b2:
message = input("Het te versleutelen bericht: ")

under128 = 0

while under128 == 0:
    key = int(input("Hoeveel ascii-plaatsen de karakters worden verschoven: "))

    if -128 <= key <= 128:
        encipheredText = ""
        under128 = 1

        for i in message:
            chrValue = ord(i)

            if chrValue + key > 127:
                newValue = chrValue + key - 128
            else:
                newValue = chrValue + key
            encipheredText += chr(newValue)

        print(encipheredText)

    else:
        print("De hoeveelheid ASCII-plaatsen moet onder de 128 liggen")
        continue
