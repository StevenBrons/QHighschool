import math
from fractions import Fraction


def fractify(afloat):
    return Fraction(afloat - int(afloat))


def checkval(afloat):
    if afloat.is_integer():
        return str( int(afloat) ) + " exactly"
    elif len(str( fractify(afloat) )) < 10:
        return str( int(afloat) ) + " " + str(fractify(afloat))
    else:
        return str(afloat)


x = 0

while x == 0:
    a, b, c = int(input("For ax^2 + bx + c = 0 \nInput a: ")), int(input("Input b: ")), int(
        input("Input c: "))

    successMsg1 = "For " + str(a) + "x^2 + " + str(b) + "x + " + str(c) + ", x = {}. \n"
    successMsg2 = "For " + str(a) + "x^2 + " + str(b) + "x + " + str(c) + ", x = {} OR x = {}. \n"

    disc = b ** 2 - 4 * a * c

    if disc < 0:
        print("The discriminant is negative. Therefore, there's no real value to be outputted. \n")

    else:
        plusCalc = (-b + math.sqrt(disc)) / (2 * a)
        minCalc = (-b - math.sqrt(disc)) / (2 * a)

        if plusCalc == minCalc:
            print("The discriminant equals 0. This calculation will yield a single result. \n")
            print(successMsg1.format(checkval(plusCalc)))

        else:
            print("The discriminant is positive and more than 0. This calculation will produce two different outcomes. \n")
            print(successMsg2.format(checkval(plusCalc), checkval(minCalc)))
