$(document).ready(() => {
  $("#content").prepend('<div id="course_header"/>');
  $("img")
    .first()
    .addClass("header-image");
  $("#course_header").append($("#content").find("img:first"));
  $("pre code").addClass("language-" + document.__language);
  $("pre").addClass("line-numbers");
  Prism.highlightAll(
    async () => {},
    () => {}
  );
  let list = initTOC({ selector: "h1, h2" });
  $("#TOC").append(list);
});

window.MathJax = {
  tex: {
    inlineMath: [["$", "$"]]
  }
};

// function indentCode(code) {
//   let lines = code.split("\n");
// }
