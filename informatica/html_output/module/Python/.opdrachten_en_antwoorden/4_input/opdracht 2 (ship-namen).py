# b:
import random

# a:
nameOne = input()
nameTwo = input()

# b:
randOne = random.randint(2, len(nameOne) - 1)
randTwo = random.randint(2, len(nameTwo) - 1)

# c + d:
partOne = nameOne[0:randOne]
partTwo = nameTwo[-randTwo:]

# e:
shipname = partOne + partTwo
print(shipname)
