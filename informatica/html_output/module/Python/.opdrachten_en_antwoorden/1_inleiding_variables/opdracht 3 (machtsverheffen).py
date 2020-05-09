# a:
exponents = ""
ogValue = 9

# b1:
exponents += str(ogValue) + " "
exponents += str(ogValue * ogValue) + " "
exponents += str(ogValue * ogValue * ogValue) + " "
exponents += str(ogValue * ogValue * ogValue * ogValue)

print(exponents)

# b2:
expOne = ogValue * ogValue
expTwo = expOne * ogValue
expThree = expTwo * ogValue

print(ogValue, expOne, expTwo, expThree)
