import math
from fractions import Fraction  # imports

x = 0

while x == 0:  # after result the script will run again
    a, b, c = int(input("For ax^2 + bx + c = 0 \nInput a: ")), int(input("Input b: ")), int(
        input("Input c: "))  # ask for inputs

    successMsg1 = "For " + str(a) + "x^2 + " + str(b) + "x + " + str(c) + ", x = {}. \n"
    successMsg2 = "For " + str(a) + "x^2 + " + str(b) + "x + " + str(c) + ", x = {} OR x = {}. \n"

    ex = " exactly"

    disc = b ** 2 - 4 * a * c  # calculate discriminant (for reading ease)

    ##################################################################################################################################################################################################################################

    if disc < 0:  # restart script if discriminant is negative (since no real value outputs)
        print("The discriminant is negative. Therefore, there's no real value to be outputted. \n")
        continue

    ##################################################################################################################################################################################################################################

    elif disc == 0:  # calculate a single solution if only one exists (so if disc == 0)

        plusCalc = (-b + math.sqrt(disc)) / (2 * a)
        plusFrac = Fraction(plusCalc - math.floor(plusCalc))

        print("The discriminant equals 0. This calculation will yield a single result. \n")

        if plusCalc.is_integer():
            print(successMsg1.format(str(int(plusCalc)) + ex))  # if int, prints int

        elif len(str(plusFrac)) < 10:  # if not int, checks for nice fraction, prints nice fraction
            print(successMsg1.format(str(math.floor(plusCalc)) + " " + str(plusFrac)))

        else:
            print(successMsg1.format(str(plusCalc)))  # if neither, prints float

    ##################################################################################################################################################################################################################################

    else:  # if two solutions, calculate both (so if disc > 0)

        plusCalc = (-b + math.sqrt(disc)) / (2 * a)
        minCalc = (-b - math.sqrt(disc)) / (2 * a)

        plusFrac = Fraction(plusCalc - math.floor(plusCalc))
        minFrac = Fraction(plusCalc - math.floor(plusCalc))

        print("The discriminant is positive and more than 0. This calculation will produce two different outcomes. \n")

        if plusCalc.is_integer() and minCalc.is_integer():  # checks if both are ints
            print(successMsg2.format(str(int(plusCalc)) + ex, str(int(minCalc)) + ex))

        elif plusCalc.is_integer() or minCalc.is_integer():  # if not, checks if only one is int
            if plusCalc.is_integer():  # if one is int, prints int of that one
                if len(str(minFrac)) < 10:  # if other is nice fraction, prints that one as nice fraction
                    print(successMsg2.format(str(int(plusCalc)) + ex, str(math.floor(minCalc)) + " " + str(
                        minFrac)))
                else:
                    print(
                        successMsg2.format(str(int(plusCalc)) + ex, str(minCalc)))  # if not, print as float
            elif minCalc.is_integer():  # same steps
                if len(str(plusFrac)) < 10:
                    print(successMsg2.format(str(int(minCalc)) + ex, str(math.floor(plusCalc)) + " " + str(plusFrac)))
                else:
                    print(successMsg2.format(str(int(minCalc)) + ex, str(plusCalc)))

        elif len(str(plusFrac)) < 10 or len(str(minFrac)) < 10:  # if either is a nice fraction
            if len(str(plusFrac)) < 10 and len(str(minFrac)) < 10:  # if both are a nice fraction, print both as such
                print(successMsg2.format(str(math.floor(plusCalc)) + " " + str(plusFrac),
                                         str(math.floor(minCalc)) + " " + str(minFrac)))
            elif len(str(plusFrac)) < 10:  # if only one is, print only that one
                print(successMsg2.format(str(math.floor(plusCalc)) + " " + str(plusFrac), str(minCalc)))
            elif len(str(minFrac)) < 10:
                print(successMsg2.format(str(math.floor(minCalc)) + " " + str(minFrac), str(plusCalc)))

        else:  # else just print as floats
            print(successMsg2.format(str(minCalc), str(plusCalc)))
