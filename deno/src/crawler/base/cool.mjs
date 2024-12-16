

const url = "https://www.cool18.com/bbs4/index.php?app=forum&act=threadview&tid=14122637";

const list_n = [" <font color=#E6E6DD>cool18.com</font><p></p>　　"];

export const base_crawler_cool = new class Struct_base_crawler {
  // 构造函数
  constructor(parameters) {
    // 
  }

  // HTML文档内容
  #html = "";
  set_html(html = "") {
    this.#html = html;
  }
  get_html() {
    return this.#html;
  }

  get_data() {
    // 
  }
};

