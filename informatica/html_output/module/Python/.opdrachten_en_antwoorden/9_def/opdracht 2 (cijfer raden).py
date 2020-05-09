from random import randint


def validattempt(guess):
    if guess.isnumeric() and 0 <= int(guess) <= int(upto):
        return True
    else:
        print("The input is invalid!")
        validattempt(input("Please try again! "))


def iscorrect(guess):
    if validattempt(guess) and int(guess) == number:
        return True
    else:
        print("This is not the number! \n")
        return False


upto = input("Please enter an integer; the script will generate a number between 0 and your number. ")
while not upto.isnumeric():
    upto = input("Invalid type! Please enter an integer! ")

number = randint(0, int(upto))

entry = input("Please enter your guess. ")
while not iscorrect(entry):
    entry = input("Please enter your guess. ")

print("Congratulations, that's correct!")
