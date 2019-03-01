let fs = require("file-system");
class pqueue{
    constructor(arr,compare)
    {
        if (compare === void 0) { compare = pqueue.defaultCompare; }
        this.arr = arr || [];
        this.arr.push(null);
        this.compare = compare;
    }
    defcompare(e1,e2){
        return e1.weight > e2.weight;
    }
    isEmpty(){
        return this.arr.length == 1;
    }
    GetSize(){
        return this.arr.length - 1;
    }
    insert(value){
        this.arr[this.arr.length] = value;
        let pos = this.arr.length - 1;
        while (this.find_parent(pos) >= 1) {
            if (!this.compare(this.arr[pos], this.arr[this.find_parent(pos)])) {
                this.swap(pos, this.find_parent(pos));
                pos = this.find_parent(pos);
            }
            else {
                break;
            }
        }
    }
    delete_min(){
        let rtn = this.arr[1];
        this.arr[1] = this.arr[this.arr.length - 1];
        this.arr.splice(this.arr.length - 1, 1);
        let pos = 1;
        while (pos * 2 <= this.arr.length - 1) {
            if (this.arr.length === 3) {
                if (this.compare(this.arr[pos], this.arr[this.find_lchild(pos)])) {
                    this.swap(pos, this.find_lchild(pos));
                    pos = this.find_lchild(pos);
                }
                break;
            }
            if (this.find_rchild(pos) > this.arr.length - 1) {
                if (this.compare(this.arr[pos], this.arr[this.find_lchild(pos)])) {
                    this.swap(pos, this.find_lchild(pos));
                    pos = this.find_lchild(pos);
                }
                else {
                    break;
                }
            }
            else {
                if (this.compare(this.arr[this.find_lchild(pos)], this.arr[this.find_rchild(pos)])) {
                    if (this.compare(this.arr[pos], this.arr[this.find_rchild(pos)])) {
                        this.swap(pos, this.find_rchild(pos));
                        pos = this.find_rchild(pos);
                    }
                    else {
                        break;
                    }
                }
                else {
                    if (this.compare(this.arr[pos], this.arr[this.find_lchild(pos)])) {
                        this.swap(pos, this.find_lchild(pos));
                        pos = this.find_lchild(pos);
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return rtn;
    }
    swap(i,j){
        let temp = this.arr[i];
        this.arr[i] = this.arr[j];
        this.arr[j] = temp;
    }
    find_parent(i){
        return Math.floor(i / 2);
    }
    find_lchild(i){
        return 2 * i; 
    }
    find_rchild(i){
        return 2 * i + 1; 
    }
    getarray(){
        return this.arr;
    }
    output(){
        console.log(this.arr);
    }
}
class symbol{
    constructor(s,f){
        this.symbol = s;
        this.frequency = f;
    }
}
class node{
    constructor(l,r,p,s){
        this.lchild = l;
        this.rchild = r;
        this.parent = p;
        this.symbol = s;
    }
}
class huffman{
    constructor(){

    }
    encode(){
        let input = fs.readFileSync('infile.dat', "utf8");
        input = input.replace(/\W/g, "");
        this.total_string = input.split("").length;
        let pq = new pqueue([], function (e1, e2) { return e1.symbol.frequency > e2.symbol.frequency; });
        let map = {};
        for (let i = 0; i < input.length; i++) {
            let char = input[i];
            if (map[char] == null) {
                map[char] = 1;
            }
            else {
                map[char]++;
            }
        }
        let freq_table = [];
        for (let prop in map) {
            let sym = new symbol(prop, map[prop]);
            let treeNode = new node(null, null, null, sym);
            pq.insert(treeNode);
            freq_table.push(sym);
        }
        freq_table.sort(function (a, b) {
            if (a.frequency > b.frequency) {
                return -1;
            }
            else if (a.frequency == b.frequency) {
                return 0;
            }
            else {
                return 1;
            }
        });
        while (pq.GetSize() > 1) {
            let least = pq.delete_min();
            let second = pq.delete_min();
            let sym = new symbol(null, least.symbol.frequency + second.symbol.frequency);
            let new_tree_node = new node(least, second, null, sym);
            least.parent = new_tree_node;
            second.parent = new_tree_node;
            pq.insert(new_tree_node);
        }
        let root = pq.getarray()[1];
        this.depthfirstsearch(root, "");
        let output_string = "";
        output_string = "Symbol|frequency|Huffman Codes\n";
        for (let i = 0; i < freq_table.length; i++) {
            this.total_bits = this.total_bits + (freq_table[i].frequency * this.huffman_code_table[freq_table[i].symbol].split("").length);
            output_string += freq_table[i].symbol + '|' + parseFloat((freq_table[i].frequency / this.total_string).toFixed(4)) * 100 + '%' + '|' + this.huffman_code_table[freq_table[i].symbol] + "\n";
        }
        output_string += "Total Bits:" + this.total_bits;
        fs.writeFileSync("outfile.dat", output_string);
        console.log("successfully generated the table in outfile.dat");
    }
    depthfirstsearch(root,path){
        if (root.lchild == null && root.rchild == null) {
            this.huffman_code_table[root.symbol.symbol] = path;
            return;
        }
        else if (root.lchild != null && root.rchild == null) {
            this.depthfirstsearch(root.lchild, path + "0");
        }
        else if (root.lchild == null && root.rchild != null) {
            this.depthfirstsearch(root.rchild, path + "1");
        }
        else {
            this.depthfirstsearch(root.lchild, path + "0");
            this.depthfirstsearch(root.rchild, path + "1");
        }
    }
}
let huffman_code= new huffman();
huffman_code.huffman_code_table = {};
huffman_code.total_bits = 0;
huffman_code.total_string = 0;
huffman_code.encode();