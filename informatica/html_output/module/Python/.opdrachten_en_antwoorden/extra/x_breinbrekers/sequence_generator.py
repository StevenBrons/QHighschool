import random


def alterindex(xlist, strindex, charindex, changeto):
    templist = list(xlist[strindex])
    templist[charindex] = changeto
    xlist[strindex] = "".join(templist)


def randroutes(file):
    routesamount = random.randint(3, 26)

    routeschoices = []
    rightway = []
    for i in range(routesamount):
        rightway.append(i)
        routeschoices.append("0"*routesamount)
        alterindex(routeschoices,i, i, "p")

    random.shuffle(rightway)

    for j in range(routesamount - 1):
        alterindex(routeschoices, rightway[j], rightway[j+1], "1")
        alterindex(routeschoices, rightway[j+1], rightway[j], "p")

    random.shuffle(rightway)

    for k in range(routesamount):
        for l in range(routesamount):
            if routeschoices[rightway[k]][l] == "0":
                if random.random() <= 0.50:
                    alterindex(routeschoices, rightway[k], l, "1")
                    alterindex(routeschoices, l, rightway[k], "p")
                else:
                    alterindex(routeschoices, rightway[k], l, "p")
                    alterindex(routeschoices, l, rightway[k], "1")
            else: continue

    for m in range(routesamount):
        for n in range(routesamount):
            if routeschoices[m][n] == "p":
                alterindex(routeschoices, m, n, "0")

    file.write(str(routesamount) + "\n")
    for o in routeschoices:
        file.write(o + "\n")
    file.write("\n")


f = open("routeoptions.txt", "w+")

for p in range(100):
    randroutes(f)
