let str = "ctx.body=asd";

let code =
  "let id = ctx.params.id\nlet users = [{\n  id: \"1\",\n  name: '樱木花道'\n}, {\n  id: \"2\",\n  name: '流川枫'\n}]\n\nlet user = users.find(item => item.id == id)\nctx.body = user";

console.log(code)
console.log("___________________")
code = code.replace(/ctx\.body/g, "ctx.$body");
console.log(code);
