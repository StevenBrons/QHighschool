(this.webpackJsonpmarketing_site=this.webpackJsonpmarketing_site||[]).push([[0],{125:function(e,t,r){},126:function(e,t,r){},127:function(e,t,r){},128:function(e,t,r){},129:function(e,t,r){},134:function(e,t,r){},137:function(e,t,r){"use strict";r.r(t);r(70);var n=r(65),a=r.n(n),o=r(0),c=r.n(o),s=r(66),i=r.n(s),l=r(4),u=r(5),p=r(7),h=r(6),m=r(8);r(125),r(126);function f(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return"M"+(e+"").padStart(4,"0")}var d=function(e){function t(e){var r;return Object(l.a)(this,t),(r=Object(p.a)(this,Object(h.a)(t).call(this,e))).ref=c.a.createRef(),r}return Object(m.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){window.scrollTo({top:this.ref.current.offsetTop-.05*window.innerHeight,behavior:"smooth"})}},{key:"render",value:function(){var e=this.props.course;return c.a.createElement("div",{className:"CourseInfo",ref:this.ref},c.a.createElement("div",{className:"text-and-image"},c.a.createElement("div",{className:"info-text"},c.a.createElement("h1",{className:"title"},e.courseName.toUpperCase()),c.a.createElement("div",{className:"period"},c.a.createElement("div",{className:"square"}),c.a.createElement("p",{className:"number"},"Blok ",e.period)),c.a.createElement("p",{className:"description-title"},"Module: Beschrijving"),c.a.createElement("p",null,e.courseDescription),c.a.createElement("button",{className:"enroll-button",onClick:function(){window.open("https://app.q-highschool.nl/aanbod?vak=".concat(e.subjectName,"&blok=").concat(e.period,"&leerjaar=").concat(e.schoolYear))}},"AANMELDEN")),c.a.createElement("div",{className:"image",style:{background:"url(https://q-highschool.nl/images/thumbnails/".concat(f(e.courseId),".jpg), url(https://q-highschool.nl/images/thumbnails/default.jpg) no-repeat"),backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundPosition:"center center"}}),c.a.createElement("button",{className:"close-button",onClick:this.props.onClose})),c.a.createElement("div",{className:"extra-info"},c.a.createElement("p",{className:"extra-info-text"},c.a.createElement("b",null,"Dag:")," ",e.day," "),c.a.createElement("p",{className:"extra-info-text"},c.a.createElement("b",null,"Doelgroep:")," ",e.enrollableFor," ")))}}]),t}(o.Component);r(127);function b(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return"M"+(e+"").padStart(4,"0")}var g=function(e){function t(){return Object(l.a)(this,t),Object(p.a)(this,Object(h.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.props,t=e.selected,r=e.large,n=e.text,a=e.onClick,o=e.courseId,s=this.props.color;return c.a.createElement("div",{className:"Course"+(r?" large":"")+(t?" selected":"")+" "+s,onClick:a,style:{backgroundImage:"url(https://q-highschool.nl/images/thumbnails/".concat(b(o),".jpg), url(https://q-highschool.nl/images/thumbnails/default.jpg)")}},c.a.createElement("h2",{className:"text"},n),c.a.createElement("img",{className:"q-logo",src:"q.svg",alt:""}),t&&c.a.createElement("div",{className:"arrow"}))}}]),t}(o.Component),v=(r(128),["purple","pink","blue","orange","red","green","yellow"]),j=function(e){function t(e){var r;Object(l.a)(this,t),(r=Object(p.a)(this,Object(h.a)(t).call(this,e))).scroller=c.a.createRef(),r.title=c.a.createRef();var n=window.innerWidth<=700?2:4,a=Math.floor((Object.keys(e.groups).length-1)/n),o=r.randomColors(Object.keys(e.groups).length);return r.state={page:0,maxPage:a,coursesPerPage:n,colors:o},window.addEventListener("resize",(function(e){if(!window.matchMedia("(pointer: coarse)").matches){if(window.innerWidth>700&&2===r.state.coursesPerPage){var t=Math.floor(r.state.page/2),n=Math.floor((Object.keys(r.props.groups).length-1)/4);r.setState({page:t,coursesPerPage:4,maxPage:n})}else if(window.innerWidth<=700&&4===r.state.coursesPerPage){var a=2*r.state.page,o=Math.floor((Object.keys(r.props.groups).length-1)/2);r.setState({page:a,coursesPerPage:2,maxPage:o})}r.scrollToPage(r.state.page)}})),r}return Object(m.a)(t,e),Object(u.a)(t,[{key:"randomColors",value:function(e){for(var t=[v[Math.floor(7*Math.random())]],r=1;r<e;r++){var n=v.slice();n.splice(n.indexOf(t[t.length-1]),1),t.push(n[Math.floor(6*Math.random())])}return t}},{key:"scrollToPage",value:function(e){var t=this.scroller.current,r=this.title.current.offsetLeft;t.scrollTo({left:t.children[this.state.coursesPerPage*e].offsetLeft-r,behavior:"smooth"}),this.setState({page:e})}},{key:"getSortedGroups",value:function(e){return Object.keys(e).map((function(t){return e[t]})).filter((function(e){return e.period>=2})).sort((function(e,t){var r=new RegExp(/(\d{4})\//),n=parseInt(e.schoolYear.match(r)[1]),a=parseInt(t.schoolYear.match(r)[1]);return parseInt(n+e.period+e.courseDescription.charCodeAt(0))-parseInt(a+t.period+t.courseDescription.charCodeAt(0))}))}},{key:"render",value:function(){var e=this,t=this.props,r=t.groups,n=t.selectedCourse,a=(t.showSubjectInfo,this.state),o=a.page,s=a.maxPage,i=a.colors;return c.a.createElement("div",{className:"SubjectRow"},c.a.createElement("h3",{className:"title",ref:this.title},this.props.title),0!==o&&c.a.createElement("div",{className:"scroll-button left",onClick:function(){return e.scrollToPage(o-1)}}),c.a.createElement("div",{className:"scroller",ref:this.scroller},this.getSortedGroups(r).map((function(t,r){var a=t.id,o=t.courseId,s=t.courseName;return c.a.createElement(g,{key:a,groupId:a,courseId:o,class:"course",onClick:function(t){return e.props.onClick(a)},text:s,selected:n===a,large:e.props.large,color:i[r]})}))),o!==s&&c.a.createElement("div",{className:"scroll-button right",onClick:function(){return e.scrollToPage(o+1)}}))}}]),t}(o.Component),E=(r(129),function(e){function t(){return Object(l.a)(this,t),Object(p.a)(this,Object(h.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.props,t=e.previousSubject,r=e.nextSubject,n=e.subject,a=e.onClose,o=e.description;return c.a.createElement("div",{className:"SubjectInfo"},c.a.createElement("div",{className:"button-container"},t&&c.a.createElement("div",{className:"button previous-subject",onClick:t})),c.a.createElement("div",{className:"text"},c.a.createElement("h1",{className:"title"},"Waar gaat het vak ",n," over?"),c.a.createElement("p",null,o)),c.a.createElement("div",{className:"button-container"},r&&c.a.createElement("div",{className:"button next-subject",onClick:r})),c.a.createElement("button",{className:"close-button",onClick:a}))}}]),t}(o.Component)),k=r(22),O=r.n(k),N=r(41),y=r(42),w=r.n(y);function C(){return(C=Object(N.a)(O.a.mark((function e(t){return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",w.a.ajax({url:"https://app.q-highschool.nl/api/group/list",type:"get",dataType:"json",error:t}).then((function(e){var t={};return e.filter((function(e){return e.enrollable})).forEach((function(e){t[e.subjectName]||(t[e.subjectName]={}),t[e.subjectName][e.id]=e})),t})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function S(){return(S=Object(N.a)(O.a.mark((function e(t){return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",w.a.ajax({url:"https://app.q-highschool.nl/api/subject/list",type:"get",dataType:"json",error:t}).then((function(e){var t={};return e.forEach((function(e){t[e.name]=e.description})),t})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var I=r(67),x=r.n(I),P=function(e){function t(e){var r;return Object(l.a)(this,t),(r=Object(p.a)(this,Object(h.a)(t).call(this,e))).state={isShowing:!1},r}return Object(m.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.timeout=setTimeout((function(){return e.setState({isShowing:!0})}),300)}},{key:"componentWillUnmount",value:function(){clearTimeout(this.timeout)}},{key:"render",value:function(){return this.state.isShowing?c.a.createElement(x.a,{color:"#ff7a03"}):null}}]),t}(o.Component),M=function(e){function t(e){var r;return Object(l.a)(this,t),(r=Object(p.a)(this,Object(h.a)(t).call(this,e))).componentDidMount=function(){(function(e){return C.apply(this,arguments)})(r.handleError).then((function(e){return r.setState({courses:e,serverError:!1})})),function(e){return S.apply(this,arguments)}(r.handleError).then((function(e){return r.setState({subjectDescriptions:e,serverError:!1})}))},r.handleError=function(e){console.log(e),r.setState({serverError:!0})},r.onClick=function(e,t){var n=r.state.popOut;n=n&&n.group===t&&n.courseId===e?null:{group:t,courseId:e},r.setState({popOut:n})},r.showSubjectInfo=function(e){e!==r.state.subjectInfo?r.setState({subjectInfo:e}):r.removeSubjectInfo()},r.removeSubjectInfo=function(){r.setState({subjectInfo:null})},r.state={popOut:null,subjectInfo:null,courses:null,subjectDescriptions:null,serverError:!1},r}return Object(m.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this,t=this.state,r=t.popOut,n=t.courses,a=t.subjectInfo,o=t.subjectDescriptions;if(t.serverError)return c.a.createElement("h1",{className:"error"},"Er is een fout opgetreden met het verbinden met de server.");if(!n)return c.a.createElement(P,null);var s,i,l=Object.keys(n).sort().filter((function(e){return!e.startsWith("@")}));if(a){var u=l.indexOf(a);u<l.length-1&&(s=function(){return e.showSubjectInfo(l[u+1])}),u>0&&(i=function(){return e.showSubjectInfo(l[u-1])})}return c.a.createElement("div",{className:"Page"},a&&c.a.createElement(E,{nextSubject:s,previousSubject:i,subject:a,description:o[a],onClose:function(){return e.showSubjectInfo(null)}}),l.map((function(t,a){return c.a.createElement(c.a.Fragment,{key:a},c.a.createElement(j,{title:t,key:a,groups:n[t],onClick:function(r){return e.onClick(r,t)},selectedCourse:r&&r.courseId,showSubjectInfo:function(){return e.showSubjectInfo(t)}}),r&&r.group===t&&c.a.createElement(d,{course:n[r.group][r.courseId],key:Math.random(),group:t,onClose:function(t){return e.onClick(r.courseId,r.group)}}))})),c.a.createElement("div",{style:{height:"300px"}}))}}]),t}(o.Component);r(134);r(135),a.a.polyfill(),i.a.render(c.a.createElement(M,null),document.getElementById("root"))},69:function(e,t,r){e.exports=r(137)}},[[69,1,2]]]);
//# sourceMappingURL=main.e501ec18.chunk.js.map