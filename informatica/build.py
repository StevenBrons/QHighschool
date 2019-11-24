import sys
import os
import subprocess
import fileinput
from os.path import dirname, abspath
import json
with open("./markdown_filter.json") as mdfilter_file:
    markdownFilter = json.load(mdfilter_file)
with open("./html_filter.json") as htmlfilder_file:
    htmlFilter = json.load(htmlfilder_file)
with open('./_header.html') as _headerFile:
    _header = _headerFile.read()
with open('./_footer.html') as _footerFile:
    _footer = _footerFile.read()


def replaceInFile(fileName, replaceList):
    for line in fileinput.input(fileName, inplace=True):
        for item in replaceList:
            line = line.replace(item[0], item[1])
        print(line, end="")


def addHeaderAndFooter(fileName):
    with open(fileName, 'r+') as f:
        content = f.read()
        f.seek(0, 0)
        f.write(_header + content + _footer)


def docxToMarkdown(fileName):
    try:
        res = subprocess.check_output(
            ["pandoc", fileName, "-f", "docx", "-t", "markdown", "--extract-media", dirname(fileName), "-o", fileName])
        replaceInFile(fileName, markdownFilter)
        pre, ext = os.path.splitext(fileName)
        os.rename(fileName, pre + ".md")
        pass
    except Exception as e:
        pass


def markdownToHtml(fileName):
    res = subprocess.check_output(
        ["pandoc", fileName, "-f", "markdown", "-t", "html", "--toc", "--toc-depth=2", "-o", fileName])
    replaceInFile(fileName, htmlFilter)
    addHeaderAndFooter(fileName)
    pre, ext = os.path.splitext(fileName)
    os.rename(fileName, pre + ".html")


def loopThroughFiles(rootPath, extension, callback):
    for path, subdirs, files in os.walk(rootPath):
        for name in files:
            fileName = os.path.join(path, name)
            if fileName.find("/.") == -1:
                if fileName.endswith(extension):
                    callback(fileName)


def main():
    subprocess.call("rm -R markdown_output".split(" "))
    subprocess.call("rm -R html_output/module".split(" "))
    subprocess.call("rm -R docx_source".split(" "))

    x = subprocess.check_output(["unzip", "*.zip", "-d", "docx_source"])
    subprocess.call(
        "rsync -av --exclude=\".*\" ./docx_source/ ./markdown_output".split(" "))
    loopThroughFiles("markdown_output/", "docx", docxToMarkdown)
    subprocess.call(
        "rsync -av --exclude=\".*\" ./markdown_output/ ./html_output/module/".split(" "))
    loopThroughFiles("html_output/", "md", markdownToHtml)


main()
