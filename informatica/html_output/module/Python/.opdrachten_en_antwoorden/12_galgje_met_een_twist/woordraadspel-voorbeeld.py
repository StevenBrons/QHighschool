######################################   Function Definitions   ########################################################

from random import random


def iscomplete(string):
    if "_" not in string:
        return True
    else:
        return False


def validentry(entry):
    if " " in entry:
        entryList = entry.split(" ")
        if entryList[0].isdigit() and 97 <= ord(entryList[1]) <= 122:
            return True
    else:
        print("This input is not correct, try again!")
        return False


def checkchar(entry):
    global alteredWord

    entryList = entry.split(" ")
    index = int(entryList[0])
    char = entryList[1]

    if alteredWord[index] == "_":
        if char == word[index]:
            print("That's correct!")
            alteredWord = alterindex(alteredWord, index, char)
        else:
            print("This is not the correct character for that position.")
            print(isvowel(word[index]).format(str(index)))
    else:
        print("This is not a valid index! Please try again.")


def alterindex(string, index, changeto):
    templist = list(string)
    templist[index] = changeto
    string = "".join(templist)
    return string


def isvowel(char):
    vowels = ["a", "o", "u", "e", "i", "y"]
    if char in vowels:
        return "The character in location {} is a vowel."
    else:
        return "The character in location {} is a consonant."


def isverified(answer):
    verify = input("Are you sure your guess is going to be \'%s\'? Reply with \'y(es)\' or \'n(o)\'. " % answer[6:])

    if verify == "yes" or "y":
        return True
    elif verify == "n" or "no":
        return False
    else:
        print("This is not a correct response! Please try again.")
        isverified(answer)


###############################################   Generation Sequence   ################################################


word = ""
x = False

while not x:
    global word
    word = input("What's the word? ")
    for i in word:
        if 97 <= ord(i) <= 122:
            x = True
            continue
        else:
            print("This is incorrect input!")
            x = False
            break

alteredWord = ""
numbers = ""

for j in range(0, len(word)):
    numbers += str(j)

for i in word:
    if random() < 0.6:
        alteredWord += i
    else:
        alteredWord += "_"

print("The word is:")

#################################################   Checking Loop   ####################################################

while not iscomplete(alteredWord):
    print(alteredWord + "\n" + numbers + "\n")
    guess = input(
        "Guess the location and the letter (in the form \'location letter\'), or guess the whole word outright using \'guess ...\': ")
    if validentry(guess):
        checkchar(guess)
    elif guess[0:6] == "guess ":
        if isverified(guess):
            if word == guess[6:]:
                print("Congratulations! You guessed it right!")
                alteredWord = word
            else:
                print("Bummer. You failed to solve it correctly. Better luck next time!")

if iscomplete(alteredWord):
    print("You solved it!")
