(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{527:function(t,e,r){"use strict";r.r(e);r(59),r(5),r(83);var n=["Binary (Base 2)","Ternary (Base 3)","Quaternary (Base 4)","Octal (Base 8)","Decimal (Base 10)","Hexadecimal (Base 16)"],c={};n.map((function(t){return c[t]=""}));var l={data:function(){return{result:c,fromValue:"1234567890",fromFormat:"Decimal (Base 10)",formats:n,custom:[]}},methods:{calculate:function(){var input,base;switch(this.fromFormat){case"Binary (Base 2)":base=2;break;case"Ternary (Base 3)":base=3;break;case"Quaternary (Base 4)":base=4;break;case"Octal (Base 8)":base=8;break;case"Decimal (Base 10)":base=10;break;case"Hexadecimal (Base 16)":base=16}try{input=parseInt(this.fromValue,base)}catch(t){return this.result["Binary (Base 2)"]=t.toString(),this.result["Ternary (Base 3)"]=t.toString(),this.result["Quaternary (Base 4)"]=t.toString(),this.result["Octal (Base 8)"]=t.toString(),this.result["Decimal (Base 10)"]=t.toString(),this.result["Hexadecimal (Base 16)"]=t.toString(),void this.custom.map((function(e){return e.txt=t.toString()}))}this.result["Binary (Base 2)"]=input.toString(2),this.result["Ternary (Base 3)"]=input.toString(3),this.result["Quaternary (Base 4)"]=input.toString(4),this.result["Octal (Base 8)"]=input.toString(8),this.result["Decimal (Base 10)"]=input.toString(10),this.result["Hexadecimal (Base 16)"]=input.toString(12),this.custom.map((function(t){try{t.txt=input.toString(t.base)}catch(e){t.txt=e.toString()}}))}},mounted:function(){this.calculate()},watch:{fromFormat:function(){this.calculate()}}},o=r(70),m=r(93),d=r.n(m),f=r(265),v=r(436),h=r(398),x=r(525),B=r(185),y=r(526),_=r(451),k=r(453),component=Object(o.a)(l,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("div",{staticClass:"mx-2"},[r("div",{staticClass:"d-flex mb-3"},[r("v-row",{attrs:{"no-gutters":""}},[r("v-col",{attrs:{cols:"4"}},[r("v-select",{staticClass:"mr-3",attrs:{label:"From",items:t.formats,outlined:"",dense:"","hide-details":""},model:{value:t.fromFormat,callback:function(e){t.fromFormat=e},expression:"fromFormat"}})],1),t._v(" "),r("v-col",{attrs:{cols:"8"}},[r("v-text-field",{staticClass:"mr-3",attrs:{label:"Value",outlined:"",dense:"","hide-details":""},on:{input:t.calculate},model:{value:t.fromValue,callback:function(e){t.fromValue=e},expression:"fromValue"}})],1)],1)],1)]),t._v(" "),r("div",{staticClass:"d-flex flex-wrap"},[t._l(t.result,(function(e,n){return r("v-card",{key:n,staticClass:"mx-2 my-2 flex-grow-1",attrs:{hover:""},on:{click:function(r){t.$copyText(e).then((function(){return t.$bus.$emit("append-msg","Copied")}))}}},[r("v-card-title",[t._v(" "+t._s(n)+" ")]),t._v(" "),r("v-card-text",[t._v("\n        "+t._s(e)+"\n      ")])],1)})),t._v(" "),t._l(t.custom,(function(e,i){return r("v-card",{key:i,staticClass:"mx-2 my-2 flex-grow-1",attrs:{hover:""},on:{click:function(r){t.$copyText(e.txt).then((function(){return t.$bus.$emit("append-msg","Copied")}))}}},[r("v-card-title",[r("v-text-field",{staticClass:"mr-3",attrs:{label:"Base (2-36)",outlined:"",dense:"",type:"number","hide-details":""},on:{input:t.calculate,click:function(t){t.stopPropagation()}},model:{value:e.base,callback:function(r){t.$set(e,"base",r)},expression:"item.base"}}),t._v(" "),r("v-btn",{attrs:{icon:""},on:{click:function(e){return e.stopPropagation(),t.custom.pop(i)}}},[r("v-icon",[t._v(" mdi-close ")])],1)],1),t._v(" "),r("v-card-text",[t._v("\n        "+t._s(e.txt)+"\n      ")])],1)})),t._v(" "),r("v-card",{staticClass:"mx-2 my-2 flex-grow-1 d-flex align-center justify-center",attrs:{hover:""},on:{click:function(e){t.custom.push({base:2}),t.calculate()}}},[r("v-icon",[t._v(" mdi-plus ")]),t._v(" "),r("v-card-subtitle",[t._v(" Custom Base ")])],1)],2)])}),[],!1,null,null,null);e.default=component.exports;d()(component,{VBtn:f.a,VCard:v.a,VCardSubtitle:h.a,VCardText:h.b,VCardTitle:h.c,VCol:x.a,VIcon:B.a,VRow:y.a,VSelect:_.a,VTextField:k.a})}}]);