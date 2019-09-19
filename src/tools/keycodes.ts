const keycodes = {BACKSPACE:8, TAB:9, ENTER:13, SHIFT:16, CTRL:17, ALT:18, PAUSEBREAK:19, CAPSLOCK:20, ESCAPE:27, PAGEUP:33, PAGEDOWN:34, END:35, HOME:36, LEFT:37, UP:38, RIGHT:39, DOWN:40, INSERT:45, DELETE:46, ZERO:48, ONE:49, TWO:50, THREE:51, FOUR:52, FIVE:53, SIX:54, SEVEN:55, EIGHT:56, NINE:57, A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77, N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90, LWINDOW:91, RWINDOW:92, SELECT:93, NUM0:96, NUM1:97, NUM2:98, NUM3:99, NUM4:100, NUM5:101, NUM6:102, NUM7:103, NUM8:104, NUM9:105, MULTIPLY:106, ADD:107, SUBTRACT:109, DECIMAL:110, DIVIDE:111, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, NUMLOCK:144, SCROLLLOCK:145, SEMICOLON:186, EQUAL:187, COMMA:188, DASH:189, PERIOD:190, FORWARDSLASH:191, GRAVEACCENT:192, BACKSLASH:220, OPENBRACKET:219, CLOSEBRACKET:221, SINGLEQUOTE:222, SPACEBAR:32};

const keydigits = [keycodes.ZERO, keycodes.ONE, keycodes.TWO, keycodes.THREE, keycodes.FOUR, keycodes.FIVE, keycodes.SIX, keycodes.SEVEN, keycodes.EIGHT, keycodes.NINE, keycodes.NUM0, keycodes.NUM1, keycodes.NUM2, keycodes.NUM3, keycodes.NUM4, keycodes.NUM5, keycodes.NUM6, keycodes.NUM7, keycodes.NUM8, keycodes.NUM9];

const keytime = [keycodes.ZERO, keycodes.ONE, keycodes.TWO, keycodes.THREE, keycodes.FOUR, keycodes.FIVE, keycodes.SIX, keycodes.SEVEN, keycodes.EIGHT, keycodes.NINE, keycodes.SEMICOLON, keycodes.NUM0, keycodes.NUM1, keycodes.NUM2, keycodes.NUM3, keycodes.NUM4, keycodes.NUM5, keycodes.NUM6, keycodes.NUM7, keycodes.NUM8, keycodes.NUM9];

const keymove = [keycodes.BACKSPACE, keycodes.UP, keycodes.DOWN, keycodes.LEFT, keycodes.RIGHT, keycodes.DELETE, keycodes.PAGEUP, keycodes.PAGEDOWN, keycodes.END, keycodes.HOME, keycodes.TAB, keycodes.ENTER, keycodes.SHIFT, keycodes.CTRL, keycodes.ALT, keycodes.PAUSEBREAK, keycodes.CAPSLOCK, keycodes.ESCAPE];

var keychars = {};
keychars[keycodes.A] = 'A';
keychars[keycodes.B] = 'B';
keychars[keycodes.C] = 'C';
keychars[keycodes.D] = 'D';
keychars[keycodes.E] = 'E';
keychars[keycodes.F] = 'F';
keychars[keycodes.G] = 'G';
keychars[keycodes.H] = 'H';
keychars[keycodes.I] = 'I';
keychars[keycodes.J] = 'J';
keychars[keycodes.K] = 'K';
keychars[keycodes.L] = 'L';
keychars[keycodes.M] = 'M';
keychars[keycodes.N] = 'N';
keychars[keycodes.O] = 'O';
keychars[keycodes.P] = 'P';
keychars[keycodes.Q] = 'Q';
keychars[keycodes.R] = 'R';
keychars[keycodes.S] = 'S';
keychars[keycodes.T] = 'T';
keychars[keycodes.U] = 'U';
keychars[keycodes.V] = 'V';
keychars[keycodes.W] = 'W';
keychars[keycodes.X] = 'X';
keychars[keycodes.Y] = 'Y';
keychars[keycodes.Z] = 'Z';
keychars[keycodes.SPACEBAR] = ' ';
keychars[keycodes.ZERO] = '0';
keychars[keycodes.ONE] = '1';
keychars[keycodes.TWO] = '2';
keychars[keycodes.THREE] = '3';
keychars[keycodes.FOUR] = '4';
keychars[keycodes.FIVE] = '5';
keychars[keycodes.SIX] = '6';
keychars[keycodes.SEVEN] = '7';
keychars[keycodes.EIGHT] = '8';
keychars[keycodes.NINE] = '9';
keychars[keycodes.NUM0] = '0';
keychars[keycodes.NUM1] = '1';
keychars[keycodes.NUM2] = '2';
keychars[keycodes.NUM3] = '3';
keychars[keycodes.NUM4] = '4';
keychars[keycodes.NUM5] = '5';
keychars[keycodes.NUM6] = '6';
keychars[keycodes.NUM7] = '7';
keychars[keycodes.NUM8] = '8';
keychars[keycodes.NUM9] = '9';
keychars[keycodes.SUBTRACT] = '-';
keychars[keycodes.SEMICOLON] = ':';

export default keycodes;
export {
    keycodes,
    keydigits,
    keytime,
    keymove,
    keychars
}