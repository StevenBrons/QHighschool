# The exercise is to ask for a word,
# Of that word, 40% of the letters are changed into underscores.
# Then the user must guess the unknown letters.
# When a user makes a wrong guess, the program displays whether that letter
# was a consonant or a vowel.
# The user has as many lives as there are underscores.
# The user may only make ONE guess for the full word.

import random


# region utils
def capture_input(input_str, val_func, error_str="That is not a valid input. Please try again."):
    """
    Capture user input and pass it through a validation function.
    If that validation function doesn't return True, ask the user
    For a correct input.

    :param input_str: The question that is asked for the user input.
    :param val_func: The validation function that returns a bool whether the input is valid. This function can only take a string as argument.
    :param error_str: (Optional) The string displayed when the input is not valid.

    :type input_str: str
    :type val_func: function
    :type error_str: str

    :return: The validated user input.
    """

    while True:
        user_input = input(input_str)

        try:
            if val_func(user_input):
                return user_input
            else:
                print(error_str)
        except Exception:
            # If the validation function crashes, the input was not valid.
            print(error_str)


def hide_word(word, ratio=0.4):
    """
    Scrambles a word and returns the word with underscores as defined with the ratio.

    :param word: The word which will have its letters replaced.
    :param ratio: The ratio of replacement, between 1 and 0.

    :type word: str
    :type ratio: float

    :return: The word with underscores as letters.
    """

    # First calculate how many letters to replace.
    # Floor this amount by calling int().
    amount_to_replace = int(sum([1 if x.isalpha() else 0 for x in word]) * ratio)

    for _ in range(amount_to_replace):
        # Randomly fetch an index of a letter to replace.
        # Replace that letter with an underscore and run again.
        #
        # The while True makes sure that 40% is actually replaced.
        # Not that an already changed letter will be changed again,
        # or a space that doesn't need replacing.

        while True:
            index_to_replace = random.randint(0, len(word) - 1)
            if word[index_to_replace].isalpha():
                word = word[:index_to_replace] + "_" + word[index_to_replace + 1:]
                break

    return word


def display_word(game_word):
    """
    Helper that makes the game word align with the index numbers.
    :param game_word: The word to display.

    :return: The word but aligned.
    """

    # Display the letter with an offset.
    # The offset is the length of the number, minus one.
    # So if the index would be 10, the offset is 2.
    spaced_word = ""
    for i in range(len(game_word)):
        spaced_word += game_word[i] + (len(str(i + 1))) * " "

    return spaced_word

# endregion


def game_loop(game_word, original_word):
    """
    The main game loop. This is where the game will be played.

    :param game_word: The word that will be used in the game.
    :param original_word: The word without letters hidden.

    :type game_word: str
    :type original_word: str

    :return: Nothing.
    """

    # Setup the main variables.
    lives_left = game_word.count("_")

    # Game runs forever until lost or won,
    # in which case a break is hit.
    player_won = False
    while True:
        # Print the game status.
        print("\n\nLives left: {}\nWord: {}\n      {}".format(
            lives_left,
            display_word(game_word),
            " ".join(map(str, range(1, len(game_word) + 1)))
        ))

        # Ask if the user wants to guess the entire word.
        print("Are you ready to guess the entire word? (y/N)")
        print("WARNING: YOU ONLY GET ONE CHANCE TO GUESS THE ENTIRE WORD.")
        ready_to_guess = capture_input("> ", lambda x: True).lower() == "y"
        if ready_to_guess:
            print("What do you think the word is?")
            word_guess = capture_input("> ", lambda x: len(x) == len(original_word))

            if word_guess.lower() == original_word.lower():
                player_won = True

            break

        # Ask the user for an index.
        print("What letter do you want to guess?")
        index_to_guess = int(capture_input("> ", lambda x: x.isnumeric() and game_word[int(x) - 1] == "_", "That is not a number or valid choice. Try again.")) - 1  # -1 because indexes start at 1 as design choice.

        # Ask the user for the letter.
        print("What letter do you think that is?")
        letter_guess = capture_input("> ", lambda x: len(x) > 0 and x.isalpha())

        # If that is correct, replace the letter in game word and notify the user.
        # Otherwise, remove a life and return whether the letter is a consonant or a vowel.
        if original_word[index_to_guess].lower() == letter_guess.lower():
            game_word = game_word[:index_to_guess] + original_word[index_to_guess] + game_word[index_to_guess + 1:]

            # Player also wins if all letters are guessed.
            if game_word.lower() == original_word.lower():
                player_won = True
                break
        else:
            lives_left -= 1
            print("\nThat's not right! This letter is a {}".format(("consonant", "vowel")[original_word[index_to_guess].lower() in "aeiou"]))  # Ternary operator for vowel checking.

        # Check if the user has lives left, or if the entire word has been guessed.
        if lives_left <= 0:
            print("\n\nOops, seems you couldn't get the word right.\n"
                  "It was: {}".format(original_word))
            break

    if player_won:
        print("\n\nCongratulations! You won!")
    else:
        print("\n\nThat's not it! Too bad, you lost.\n"
              "The word was: {}".format(original_word))


def main():
    """
    The main function called upon execution.

    :return: Nothing.
    """

    # Display welcome message to user.
    print(
        "Welcome to WordGuesser 9000.\n"
        "In this game, you will be guessing a word in a hangman-like manner.\n"
        "Good luck, and have fun!\n"
    )

    # Ask for a word.
    print("Please enter the word the game will use:")
    original_word = capture_input("> ", lambda x: len(x) > 0)

    # Scramble the word.
    game_word = hide_word(original_word)

    # Run the game.
    game_loop(game_word, original_word)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        exit(0)
