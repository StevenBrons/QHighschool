exponents = ""
ogValue = int(input("Graag alleen integers!"))

exponents += str(ogValue) + " "
exponents += str(ogValue * ogValue) + " "
exponents += str(ogValue * ogValue * ogValue) + " "
exponents += str(ogValue * ogValue * ogValue * ogValue)

print(exponents)

expOne = ogValue * ogValue
expTwo = expOne * ogValue
expThree = expTwo * ogValue

print(ogValue, expOne, expTwo, expThree)
