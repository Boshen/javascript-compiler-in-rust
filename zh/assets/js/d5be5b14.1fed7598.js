"use strict";(self.webpackChunkjavascript_parser_in_rust=self.webpackChunkjavascript_parser_in_rust||[]).push([[784],{1208:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>c,default:()=>p,frontMatter:()=>i,metadata:()=>a,toc:()=>d});var s=t(1527),r=t(7660);const i={id:"semantics_analysis",title:"Semantic Analysis"},c=void 0,a={id:"semantics_analysis",title:"Semantic Analysis",description:"Semantic analysis is the process of checking whether our source code is correct or not.",source:"@site/i18n/zh/docusaurus-plugin-content-docs/current/semantic_analysis.md",sourceDirName:".",slug:"/semantics_analysis",permalink:"/javascript-parser-in-rust/zh/docs/semantics_analysis",draft:!1,unlisted:!1,editUrl:"https://github.com/oxc-project/javascript-parser-in-rust/tree/main/docs/semantic_analysis.md",tags:[],version:"current",frontMatter:{id:"semantics_analysis",title:"Semantic Analysis"},sidebar:"tutorialSidebar",previous:{title:"\u5904\u7406\u9519\u8bef",permalink:"/javascript-parser-in-rust/zh/docs/errors"},next:{title:"TypeScript",permalink:"/javascript-parser-in-rust/zh/docs/typescript"}},o={},d=[{value:"Context",id:"context",level:2},{value:"Scope",id:"scope",level:2},{value:"The Visitor Pattern",id:"the-visitor-pattern",level:3}];function l(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:'Semantic analysis is the process of checking whether our source code is correct or not.\nWe need to check against all the "Early Error" rules in the ECMAScript specification.'}),"\n",(0,s.jsx)(n.h2,{id:"context",children:"Context"}),"\n",(0,s.jsxs)(n.p,{children:["For grammar contexts such as ",(0,s.jsx)(n.code,{children:"[Yield]"})," or ",(0,s.jsx)(n.code,{children:"[Await]"}),", an error need to be raised when the grammar forbids them, for example:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-markup",children:"BindingIdentifier[Yield, Await] :\n  Identifier\n  yield\n  await\n\n13.1.1 Static Semantics: Early Errors\n\nBindingIdentifier[Yield, Await] : yield\n* It is a Syntax Error if this production has a [Yield] parameter.\n\n* BindingIdentifier[Yield, Await] : await\nIt is a Syntax Error if this production has an [Await] parameter.\n"})}),"\n",(0,s.jsx)(n.p,{children:"need to raise an error for"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"async *\n  function foo() {\n    var yield, await;\n  };\n"})}),"\n",(0,s.jsxs)(n.p,{children:["because ",(0,s.jsx)(n.code,{children:"AsyncGeneratorDeclaration"})," has ",(0,s.jsx)(n.code,{children:"[+Yield]"})," and ",(0,s.jsx)(n.code,{children:"[+Await]"})," for ",(0,s.jsx)(n.code,{children:"AsyncGeneratorBody"}),":"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-markup",children:"AsyncGeneratorBody :\n  FunctionBody[+Yield, +Await]\n"})}),"\n",(0,s.jsxs)(n.p,{children:["An example in Rome checking for the ",(0,s.jsx)(n.code,{children:"yield"})," keyword:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",metastring:"reference",children:"https://github.com/rome/tools/blob/5a059c0413baf1d54436ac0c149a829f0dfd1f4d/crates/rome_js_parser/src/syntax/expr.rs#L1368-L1377\n"})}),"\n",(0,s.jsx)(n.h2,{id:"scope",children:"Scope"}),"\n",(0,s.jsx)(n.p,{children:"For declaration errors:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-markup",children:"14.2.1 Static Semantics: Early Errors\n\nBlock : { StatementList }\n* It is a Syntax Error if the LexicallyDeclaredNames of StatementList contains any duplicate entries.\n* It is a Syntax Error if any element of the LexicallyDeclaredNames of StatementList also occurs in the VarDeclaredNames of StatementList.\n"})}),"\n",(0,s.jsxs)(n.p,{children:["We need to add a scope tree. A scope tree has all the ",(0,s.jsx)(n.code,{children:"var"}),"s and ",(0,s.jsx)(n.code,{children:"let"}),"s declared inside it.\nIt is also a parent pointing tree where we want to navigate up the tree and search for binding identifiers in parent scopes.\nThe data structure we can use is a ",(0,s.jsx)(n.a,{href:"https://docs.rs/indextree/latest/indextree/",children:(0,s.jsx)(n.code,{children:"indextree"})}),"."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:"use indextree::{Arena, Node, NodeId};\nuse bitflags::bitflags;\n\npub type Scopes = Arena<Scope>;\npub type ScopeId = NodeId;\n\nbitflags! {\n    #[derive(Default)]\n    pub struct ScopeFlags: u8 {\n        const TOP = 1 << 0;\n        const FUNCTION = 1 << 1;\n        const ARROW = 1 << 2;\n        const CLASS_STATIC_BLOCK = 1 << 4;\n        const VAR = Self::TOP.bits | Self::FUNCTION.bits | Self::CLASS_STATIC_BLOCK.bits;\n    }\n}\n\n#[derive(Debug, Clone)]\npub struct Scope {\n    /// [Strict Mode Code](https://tc39.es/ecma262/#sec-strict-mode-code)\n    /// [Use Strict Directive Prologue](https://tc39.es/ecma262/#sec-directive-prologues-and-the-use-strict-directive)\n    pub strict_mode: bool,\n\n    pub flags: ScopeFlags,\n\n    /// [Lexically Declared Names](https://tc39.es/ecma262/#sec-static-semantics-lexicallydeclarednames)\n    pub lexical: IndexMap<Atom, SymbolId, FxBuildHasher>,\n\n    /// [Var Declared Names](https://tc39.es/ecma262/#sec-static-semantics-vardeclarednames)\n    pub var: IndexMap<Atom, SymbolId, FxBuildHasher>,\n\n    /// Function Declarations\n    pub function: IndexMap<Atom, SymbolId, FxBuildHasher>,\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"The scope tree can either be built inside the parser for performance reasons, or built in a separate AST pass."}),"\n",(0,s.jsxs)(n.p,{children:["Generally, a ",(0,s.jsx)(n.code,{children:"ScopeBuilder"})," is needed:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-rust",children:"pub struct ScopeBuilder {\n    scopes: Scopes,\n    root_scope_id: ScopeId,\n    current_scope_id: ScopeId,\n}\n\nimpl ScopeBuilder {\n    pub fn current_scope(&self) -> &Scope {\n        self.scopes[self.current_scope_id].get()\n    }\n\n    pub fn enter_scope(&mut self, flags: ScopeFlags) {\n        // Inherit strict mode for functions\n        // https://tc39.es/ecma262/#sec-strict-mode-code\n        let mut strict_mode = self.scopes[self.root_scope_id].get().strict_mode;\n        let parent_scope = self.current_scope();\n        if !strict_mode\n            && parent_scope.flags.intersects(ScopeFlags::FUNCTION)\n            && parent_scope.strict_mode\n        {\n            strict_mode = true;\n        }\n\n        let scope = Scope::new(flags, strict_mode);\n        let new_scope_id = self.scopes.new_node(scope);\n        self.current_scope_id.append(new_scope_id, &mut self.scopes);\n        self.current_scope_id = new_scope_id;\n    }\n\n    pub fn leave_scope(&mut self) {\n      self.current_scope_id = self.scopes[self.current_scope_id].parent().unwrap();\n    }\n}\n"})}),"\n",(0,s.jsxs)(n.p,{children:["We then call ",(0,s.jsx)(n.code,{children:"enter_scope"})," and ",(0,s.jsx)(n.code,{children:"leave_scope"})," accordingly inside the parse functions, for example in acorn:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",metastring:"reference",children:"https://github.com/acornjs/acorn/blob/11735729c4ebe590e406f952059813f250a4cbd1/acorn/src/statement.js#L425-L437\n"})}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["One of the downsides of this approach is that for arrow functions,\nwe may need to create a temporary scope and then drop it afterwards if it is not an arrow function but a sequence expression.\nThis is detailed in ",(0,s.jsx)(n.a,{href:"/blog/grammar#cover-grammar",children:"cover grammar"}),"."]})}),"\n",(0,s.jsx)(n.h3,{id:"the-visitor-pattern",children:"The Visitor Pattern"}),"\n",(0,s.jsx)(n.p,{children:"If we decide to build the scope tree in another pass for simplicity,\nthen every node in the AST need to be visited in depth-first preorder and build the scope tree."}),"\n",(0,s.jsxs)(n.p,{children:["We can use the ",(0,s.jsx)(n.a,{href:"https://rust-unofficial.github.io/patterns/patterns/behavioural/visitor.html",children:"Visitor Pattern"}),"\nto separate out the traversal process from the operations performed on each object."]}),"\n",(0,s.jsxs)(n.p,{children:["Upon visit, we can call ",(0,s.jsx)(n.code,{children:"enter_scope"})," and ",(0,s.jsx)(n.code,{children:"leave_scope"})," accordingly to build the scope tree."]})]})}function p(e={}){const{wrapper:n}={...(0,r.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},7660:(e,n,t)=>{t.d(n,{Z:()=>a,a:()=>c});var s=t(959);const r={},i=s.createContext(r);function c(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);