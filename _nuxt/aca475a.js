(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{433:function(t,e,n){"use strict";n.r(e);var o={components:{CodeJar:n(452).a},props:{leftLabel:{type:String,default:"From"},rightLabel:{type:String,default:"To"},leftChoices:{type:Array,default:[]},rightChoices:{type:Array,default:[]},transformer:{type:Function,default:function(t){return t}},transformButtonText:{type:String,default:"Transform"},leftValue:String,rightValue:String,leftLang:String,rightLang:String},data:function(){return{left:"",right:"",leftTxt:"",rightTxt:"",live:!0}},methods:{onInput:function(code){this.leftTxt=code,this.live&&this.updateRight()},highlighter:function(t){this.$prism.highlightElement(t)},updateRight:function(){var t=this;this.$nextTick((function(){t.rightTxt=t.transformer(t.leftTxt)}))}},mounted:function(){this.left=this.leftValue,this.right=this.rightValue},watch:{left:function(t,e){e!==t&&this.$emit("left-change",t)},right:function(t,e){e!==t&&this.$emit("right-change",t)},leftValue:function(t){this.left=t},rightValue:function(t){this.right=t}}},r=n(70),l=n(93),c=n.n(l),h=n(265),f=n(436),v=n(398),d=n(525),m=n(185),_=n(526),x=n(451),y=n(522),C=n(394),component=Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("v-row",[n("v-col",{attrs:{cols:"6"}},[n("v-card",[n("v-card-text",[n("div",{staticClass:"d-flex align-center mb-3"},[n("v-select",{staticClass:"mr-3",attrs:{outlined:"",dense:"",items:t.leftChoices,label:t.leftLabel,"hide-details":""},on:{input:t.updateRight},model:{value:t.left,callback:function(e){t.left=e},expression:"left"}}),t._v(" "),n("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[n("v-btn",t._g({attrs:{icon:""},on:{click:function(e){t.$copyText(t.leftTxt).then((function(){return t.$bus.$emit("append-msg","Copied")}))}}},o),[n("v-icon",[t._v(" mdi-content-copy ")])],1)]}}])},[t._v(" "),n("span",[t._v("Copy")])])],1),t._v(" "),n("code-jar",{attrs:{codeStyle:"background:#272822;",highlighter:t.highlighter,lang:t.leftLang,"line-numbers":""},on:{input:t.onInput}})],1)],1)],1),t._v(" "),n("v-col",{attrs:{cols:"6"}},[n("v-card",[n("v-card-text",[n("div",{staticClass:"d-flex align-center mb-3"},[n("v-select",{staticClass:"mr-3",attrs:{outlined:"",dense:"",items:t.rightChoices,label:t.rightLabel,"hide-details":""},on:{input:t.updateRight},model:{value:t.right,callback:function(e){t.right=e},expression:"right"}}),t._v(" "),n("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[n("span",t._g({},o),[n("v-switch",{staticClass:"mt-0 ml-2",attrs:{inset:"","hide-details":""},model:{value:t.live,callback:function(e){t.live=e},expression:"live"}})],1)]}}])},[t._v(" "),n("span",[t._v("Live")])]),t._v(" "),t.live?t._e():n("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[n("v-btn",t._g({staticClass:"mr-2",attrs:{icon:""},on:{click:t.updateRight}},o),[n("v-icon",[t._v(" mdi-check ")])],1)]}}],null,!1,3938055381)},[t._v(" "),n("span",[t._v(t._s(t.transformButtonText))])]),t._v(" "),n("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var o=e.on;return[n("v-btn",t._g({attrs:{icon:""},on:{click:function(e){t.$copyText(t.rightTxt).then((function(){return t.$bus.$emit("append-msg","Copied")}))}}},o),[n("v-icon",[t._v(" mdi-content-copy ")])],1)]}}])},[t._v(" "),n("span",[t._v("Copy")])])],1),t._v(" "),n("code-jar",{attrs:{value:t.rightTxt,readonly:"",codeStyle:"background:#272822;",highlighter:t.highlighter,lang:t.rightLang,"line-numbers":""}})],1)],1)],1)],1)],1)}),[],!1,null,null,null);e.default=component.exports;c()(component,{VBtn:h.a,VCard:f.a,VCardText:v.b,VCol:d.a,VIcon:m.a,VRow:_.a,VSelect:x.a,VSwitch:y.a,VTooltip:C.a})}}]);