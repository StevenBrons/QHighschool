# a:

def toascii1():
    global hi
    temp = ""

    for i in hi:
        temp += str(ord(i)) + " "

    hi = temp


hi = input()
toascii1()
print(hi)


# b:

def toascii2(string):
    temp = ""

    for i in string:
        temp += str(ord(i)) + " "

    return temp


hi = input()
hi = toascii2(hi)
print(hi)