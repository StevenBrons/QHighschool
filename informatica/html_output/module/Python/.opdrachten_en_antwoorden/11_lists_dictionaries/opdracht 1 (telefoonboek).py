def checkname(name):
    try:
        lowername = name.lower()
        x = phonebook[lowername]
        print("That person has the following number: " + x)
    except KeyError:
        print("This name is not in the phonebook!")


def editmenu(command):
    global phonebook
    try:
        if command == "exit":
            return False
        else:
            splitedit = command.split(" ")
            lowername = splitedit[1].lower()
            if splitedit[0] == "add" and verified("add", splitedit):
                phonebook[lowername] = splitedit[2]
                print("A new entry in your phonebook has been made: {}, {}.".format(splitedit[1], splitedit[2]))
            elif splitedit[0] == "delete" and verified("delete", splitedit):
                phonebook.pop(lowername)
                print("The following person has been deleted from your phonebook: " + splitedit[1])
            else:
                print("This is not a valid command! Please try again. ")
            return True
    except:
        print("This is not a valid command! Please try again. ")
        return True


def verified(check, value):
    try:
        if check == "add":
            if len(value[2]) == 10 and value[2].isdigit():
                return True
            else:
                return False
        elif check == "delete":
            x = phonebook[value[1]]
            return True
    except KeyError:
        print("That person doesn't exist!")


phonebook = {}

while True:
    person = input(
        "Please enter the name of someone you'd like to know the number from, or \'pbedit\' to add or delete phone numbers. ")
    if person != "pbedit":
        checkname(person)

    else:
        print("Welcome to the edit page.")
        print(
            "Adding numbers: \'add [name] [number]\'. Deleting numbers: \'delete [name]\'. Exiting the menu: \'exit\'.\n")
        newInput = input("What would you like to do? ")

        while editmenu(newInput):
            print(
                "Adding numbers: \'add [name] [number]\'. Deleting numbers: \'delete [name]\'. Exiting the menu: \'exit\'.\n")
            newInput = input("What would you like to do? ")
