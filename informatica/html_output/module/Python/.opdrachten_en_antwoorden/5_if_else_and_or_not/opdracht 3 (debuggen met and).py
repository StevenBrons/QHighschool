def isvalid(string):
    if 0 <= int(string) <= 10:
        print("This number lies between 0 and 10!")
    elif string.isdigit():
        print("This number doesn't like between 0 and 10!")
    else: print("This is either a float or not a number!")

# a: eigen invulling

# b1:
def fixedvalid1(string):
    if string.isdigit() and 0 <= int(string) <= 10:
        print("This number lies between 0 and 10!")
    elif string.isdigit():
        print("This number doesn't lie between 0 and 10!")
    else: print("This is either a float or not a number!")

# b2:
def fixedvalid2(string):
    if string.isdigit():
        if 0 <= int(string) <= 10:
            print("This number lies between 0 and 10!")
        else: print("This number doesn't lie between 0 and 10!")
    else: print("This is either a float or not a number!")

