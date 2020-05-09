X, Y, Z = int(input()), int(input()), int(input())

if X > Y:
    if X > Z:
        z = X
        if Z > Y: x,y = Y,Z
        else: x,y = Z,Y
    else: x,y,z = Y,X,Z
else:
    if Y > Z:
        z = Y
        if Z > X: x,y = X,Z
        else: x,y = Z,X
    else: x,y,z = X,Y,Z

print(x, y, z)
