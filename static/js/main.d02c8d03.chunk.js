(this.webpackJsonpchesswebsite=this.webpackJsonpchesswebsite||[]).push([[0],{22:function(e,t,a){},23:function(e,t,a){},43:function(e,t,a){"use strict";a.r(t);var s=a(2),n=a.n(s),i=a(16),l=a.n(i),o=(a(22),a(4)),r=a(5),c=a(7),d=a(6),u=(a.p,a(23),a(17)),h=a.n(u),b=a(1);console.log("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAARpSURBVGiB7Zo/bFtVFMZ/x7EhUdN2cFSkDMSCdEnKgkSH0IAZACkgAgpL2yhCDGz8UZNgRYINhpQgQAgQIwNiARRRJJOJAVhAuEhtBUIijhpRZJyAGpw4jRMfhmcjU/XZ78XnvbhuPunIkt/1ud/ne8699517RVW5lRDZawJhY19wu2NfcLtjTwSLSEJEBkUk9P5D7VBEhkXkZyALXATyIvJcmBxQ1VAMuB8oAXoDS4XFQ8LaeIjIRWDQ5XEJSKjqlaB5hBLSItKLu1iAGPBgGFzCyuHbPbTpDJwFIQlW1Szwe4Nm34XBJcxZ+qU6z95T1V/DIBGm4C+Bj3Fm5Vr8CMyGxiKE5agTOAP8wY2XJAWKwDtAb+B8AhZ7J3C+jtDr7W/g4ZtSMHACyPkQW7Vt4PmbSjDwLHBtF2Jr7UOgo+UFA48A5SbFVu31lhYM9ABXGgmZnZ3VdDqtkUikkeAdYLiVBc97GblsNquqqn19fV5GeQk4bMXRbB0WkceAUY9t//fZAH3AK7smdh2iVo6A024PRISpqSkGB533h56eHgDm5uYoFAqsr68zMzPD2tqam4uTIvKyVsKoKRiFchfwDy5hGY/HdXt7W+thbGysUWifsOBqNcKPAt1uD1dXV0kmk/T39wPOyMbjcaanp1lZWSGfz5NOpxv18TTwbdNMjUb4DD6Wm6WlJVVVTSQSfpaoL1pp0rrNT+OtrS0AyuVyYH24wSqkY34ap1IpBgYGWF5eDqwPVxiF9DPY7Kzq2UetFNLncDb9QWLewomJYFVdBb628OWCIrBg4ciy4nEW56UhCLypqhsmnizyoiaXp7HP3XNAxIyjpeCK6LNAaWhoSHO5nG5ubvqyjY0NnZycrIr9Cjhkyc9yL11FCjja2dn5ZDwep6Ojw9ePVZVoNAqwCJxSVdcN9m5gftQiIi8CbwNEo9Eqec8ol8v/bUyAeVV9ypSgcTjfjTOjWubwaUuO1nXpUeyPTE5aOjPN4fHx8dGRkREiEbv/MZPJPCQiola5ZxjOsYWFhS01RrFY1O7u7geseFqOcGxiYiKWTCa9lm48IZPJUCgUDlj5M52lRSSPU7m0xjFVvWThyHrS+tzYH8AlwO5k0So3KpESAV6gTn3Lh5WBDzDeaQVyx0NEDgKP49ShhnHC3EtirwEXgM+AT1XVV4XAE7fdChZnZuoFjuBUI2rtQOX7OyqfvTiHa0dc3G3gFOiywJ8VywFXcS681NpV4LKqlnbF26tgETkOPAHcC9wFJPB2dyMI7OBcoVgEfgLeVdVFT7/0kJeHgE8IvoTTjJWAV6kMYF09DcR2Ad+0gCCvlgbizQh+vwVE+LXzzey0Cg2e+8VvwA/A9zhL133AceAYdvv6Qr29d8NJS0ROAW/gzLwXgF+AyzWWw1lyokBHxQRnYqnaNpBT1b9c+ujCOSWs9VH9A2p97AAHK22rdhS4BzgMvAW8pqrXXPUEsQ7vBby+UbWNYK/YvxHf7tgX3O645QT/Cym/GLJbVZClAAAAAElFTkSuQmCC");for(var p=function(e,t){return e+t+".png"},g=[],C=0;C<8;C++)for(var k=0;k<8;k++)g.push([C,k]);var A=function(e,t){for(var a=0;a<e.length;++a)if(w(e[a],t))return!0;return!1},P=function(e,t){for(var a=0;a<t.length;++a)if(w(e[0],t[a][0])&&w(e[1],t[a][1]))return!0;return!1},f=function(e){Object(c.a)(a,e);var t=Object(d.a)(a);function a(){return Object(o.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){var e,t,a=this,s=(e=this.props.x,t=this.props.y,e%2?t%2?"gray":"lightgray":t%2?"lightgray":"gray"),n=w([this.props.x,this.props.y],this.props.selected),i=this.props.reachable;return Object(b.jsx)("div",{style:{float:"left",height:"12.5%",width:"12.5% ",backgroundColor:s,display:"flex",alignItems:"center",justifyContent:"center",opacity:n||i?.75:1,boxShadow:"black"},onMouseOver:function(e){return e.currentTarget.style.opacity=.75},onMouseDown:function(e){return a.props.makeMove(a.props.x,a.props.y)},onMouseOut:function(e){return n||i?null:e.currentTarget.style.opacity=1},children:this.props.piece[0]?Object(b.jsx)("img",{src:"/chessFrontend"+p(this.props.piece[0],this.props.piece[1]),style:{width:"75%",height:"75%",cursor:"pointer"}}):null})}}]),a}(n.a.Component),y={0:"rook",1:"knight",2:"bishop",3:"queen",4:"king",5:"bishop",6:"knight",7:"rook"},w=function(e,t){if(e.length!=t.length)return!1;for(var a=0;a<e.length;++a)if(e[a]!=t[a])return!1;return!0},v=function(e){for(var t="",a=63;a>=0;a--){var s=Math.floor(a/8),n=(7-a%8)%8;w(e[[s,n]],["pawn","white"])?t+="P":w(e[[s,n]],["knight","white"])?t+="H":w(e[[s,n]],["bishop","white"])?t+="B":w(e[[s,n]],["rook","white"])?t+="R":w(e[[s,n]],["queen","white"])?t+="Q":w(e[[s,n]],["king","white"])?t+="K":w(e[[s,n]],["pawn","black"])?t+="O":w(e[[s,n]],["knight","black"])?t+="L":w(e[[s,n]],["bishop","black"])?t+="D":w(e[[s,n]],["rook","black"])?t+="C":w(e[[s,n]],["queen","black"])?t+="W":w(e[[s,n]],["king","black"])?t+="I":t+="_"}return t},S=function(e){Object(c.a)(a,e);var t=Object(d.a)(a);function a(e){var s;Object(o.a)(this,a),(s=t.call(this,e)).whiteCanCastleQueenSideCheck=function(e){var t=function(t,a){return!e.board[[t,a]][0]},a=e.whiteCanCastleQueenSide;return a=(a=(a=a&&t(7,1))&&t(7,2))&&t(7,3)},s.whiteCanCastleKingSideCheck=function(e){var t=function(t,a){return!e.board[[t,a]][0]},a=e.whiteCanCastleKingSide;return a=(a=a&&t(7,6))&&t(7,5)},s.blackCanCastleQueenSideCheck=function(e){var t=function(t,a){return!e.board[[t,a]][0]},a=e.blackCanCastleQueenSide;return a=(a=(a=a&&t(0,1))&&t(0,2))&&t(0,3)},s.blackCanCastleKingSideCheck=function(e){var t=function(t,a){return!e.board[[t,a]][0]},a=e.blackCanCastleKingSide;return a=(a=a&&t(0,6))&&t(0,5)},s.getReachablePieces=function(e,t){var a=function(t,a){return 0<=t&&t<=7&&0<=a&&a<=7&&e.board[[t,a]][1]!=e.sideToPlay},n=function(e,t){return 0<=e&&e<=7&&0<=t&&t<=7},i=[],l=e.selected[0],o=e.selected[1];if("knight"==e.selectedPiece&&(a(l+2,o-1)&&i.push([l+2,o-1]),a(l+2,o+1)&&i.push([l+2,o+1]),a(l-2,o+1)&&i.push([l-2,o+1]),a(l-2,o-1)&&i.push([l-2,o-1]),a(l+1,o+2)&&i.push([l+1,o+2]),a(l+1,o-2)&&i.push([l+1,o-2]),a(l-1,o+2)&&i.push([l-1,o+2]),a(l-1,o-2)&&i.push([l-1,o-2])),"bishop"==e.selectedPiece||"queen"==e.selectedPiece){for(var r=1;a(l+r,o+r)&&(i.push([l+r,o+r]),!e.board[[l+r,o+r]][1]||e.board[[l+r,o+r]][1]==e.sideToPlay);)r+=1;for(r=1;a(l-r,o+r)&&(i.push([l-r,o+r]),!e.board[[l-r,o+r]][1]||e.board[[l-r,o+r]][1]==e.sideToPlay);)r+=1;for(r=1;a(l+r,o-r)&&(i.push([l+r,o-r]),!e.board[[l+r,o-r]][1]||e.board[[l+r,o-r]][1]==e.sideToPlay);)r+=1;for(r=1;a(l-r,o-r)&&(i.push([l-r,o-r]),!e.board[[l-r,o-r]][1]||e.board[[l-r,o-r]][1]==e.sideToPlay);)r+=1}if("rook"==e.selectedPiece||"queen"==e.selectedPiece){for(r=1;a(l+r,o)&&(i.push([l+r,o]),!e.board[[l+r,o]][1]||e.board[[l+r,o]][1]==e.sideToPlay);)r+=1;for(r=1;a(l-r,o)&&(i.push([l-r,o]),!e.board[[l-r,o]][1]||e.board[[l-r,o]][1]==e.sideToPlay);)r+=1;for(r=1;a(l,o-r)&&(i.push([l,o-r]),!e.board[[l,o-r]][1]||e.board[[l,o-r]][1]==e.sideToPlay);)r+=1;for(r=1;a(l,o+r)&&(i.push([l,o+r]),!e.board[[l,o+r]][1]||e.board[[l,o+r]][1]==e.sideToPlay);)r+=1}if("pawn"==e.selectedPiece&&("white"==e.sideToPlay?(!a(l-1,o)||e.board[[l-1,o]][1]&&e.board[[l-1,o]][1]!=e.sideToPlay||i.push([l-1,o]),!n(l-2,o)||6!=e.selected[0]||e.board[[l-2,o]][1]&&e.board[[l-2,o]][1]!=e.sideToPlay||a(l-2,o)&&i.push([l-2,o]),n(l-1,o+1)&&e.board[[l-1,o+1]][1]&&e.board[[l-1,o+1]][1]!=e.sideToPlay&&i.push([l-1,o+1]),n(l-1,o-1)&&e.board[[l-1,o-1]][1]&&e.board[[l-1,o-1]][1]!=e.sideToPlay&&i.push([l-1,o-1])):(!a(l+1,o)||e.board[[l+1,o]][1]&&e.board[[l+1,o]][1]!=e.sideToPlay||i.push([l+1,o]),!n(l+2,o)||1!=l||e.board[[l+2,o]][1]&&e.board[[l+2,o]][1]!=e.sideToPlay||a(l+2,o)&&i.push([l+2,o]),n(l+1,o+1)&&e.board[[l+1,o+1]][1]&&e.board[[l+1,o+1]][1]!=e.sideToPlay&&i.push([l+1,o+1]),n(l+1,o-1)&&e.board[[l+1,o-1]][1]&&e.board[[l+1,o-1]][1]!=e.sideToPlay&&i.push([l+1,o-1]))),"king"==e.selectedPiece&&(a(l+1,o)&&i.push([l+1,o]),a(l-1,o)&&i.push([l-1,o]),a(l,o+1)&&i.push([l,o+1]),a(l,o-1)&&i.push([l,o-1]),a(l+1,o+1)&&i.push([l+1,o+1]),a(l-1,o+1)&&i.push([l-1,o+1]),a(l+1,o-1)&&i.push([l+1,o-1]),a(l-1,o-1)&&i.push([l-1,o-1]),"white"==e.sideToPlay?(s.whiteCanCastleQueenSideCheck(e)&&i.push([7,0]),s.whiteCanCastleKingSideCheck(e)&&i.push([7,7])):(s.blackCanCastleQueenSideCheck(e)&&i.push([0,0]),s.blackCanCastleKingSideCheck(e)&&i.push([0,7]))),t){for(var c=[],d=0;d<i.length;++d)P([e.selected,i[d]],e.allPossibleMoves)&&c.push(i[d]);return c}return i},s.alterBoard=function(e,t,a){var s=e,n=s[t][0],i=s[t][1],l="king"==e[t][0]&&"rook"==e[a][0]&&e[a][1]==e[t][1];return l&&w(a,[7,0])?(s[[7,4]]=[null,null],s[[7,0]]=[null,null],s[[7,3]]=["rook","white"],s[[7,2]]=["king","white"]):l&&w(a,[7,7])?(s[[7,4]]=[null,null],s[[7,7]]=[null,null],s[[7,5]]=["rook","white"],s[[7,6]]=["king","white"]):(s[t]=[null,null],s[a]=[n,i]),s},s.isLegalMove=function(e,t,a){var n=JSON.parse(JSON.stringify(e));n.board=s.alterBoard(n.board,t,a),n.sideToPlay="white"==n.sideToPlay?"black":"white";for(var i=s.getAllPossibleMoves(n,!1),l=0;l<i.length;++l){var o=n.board[i[l][1]];if("king"==o[0]&&o[1]==e.sideToPlay)return!1}return!0},s.getAllPossibleMoves=function(e,t){for(var a=[],n=0;n<=7;++n)for(var i=0;i<=7;++i)if(e.board[[n,i]][1]==e.sideToPlay){var l=JSON.parse(JSON.stringify(e));l.selected=[n,i],l.selectedPiece=e.board[[n,i]][0];for(var o=s.getReachablePieces(l,!1),r=0;r<o.length;++r)t?s.isLegalMove(e,[n,i],o[r])&&a.push([[n,i],o[r]]):a.push([[n,i],o[r]])}return a},s.makeMove=function(e,t){var a="king"==s.state.selectedPiece&&w([e,t],[7,0])&&s.whiteCanCastleQueenSideCheck(s.state),n="king"==s.state.selectedPiece&&w([e,t],[7,7])&&s.whiteCanCastleKingSideCheck(s.state);if(a||n||s.state.board[[e,t]][1]!==s.state.sideToPlay)if(null!=s.state.selected[0]){var i=s.state.selected[0],l=s.state.selected[1];if(A(s.getReachablePieces(s.state,!0),[e,t])){var o=s.alterBoard(s.state.board,s.state.selected,[e,t]),r=s.state.whiteCanCastleQueenSide,c=s.state.whiteCanCastleKingSide,d=s.state.blackCanCastleQueenSide,u=s.state.whiteCanCastleKingSide;"white"==s.state.sideToPlay&&"king"==s.state.selectedPiece&&(r=!1,c=!1),"black"==s.state.sideToPlay&&"king"==s.state.selectedPiece&&(d=!1,u=!1),"rook"==s.state.selectedPiece&&w([i,l],[7,0])&&(r=!1),"rook"==s.state.selectedPiece&&w([i,l],[7,7])&&(c=!1),"rook"==s.state.selectedPiece&&w([i,l],[0,0])&&(d=!1),"rook"==s.state.selectedPiece&&w([i,l],[0,7])&&(u=!1),"white"==s.state.sideToPlay?s.setState({board:o,sideToPlay:"white"==s.state.sideToPlay?"black":"white",selected:[null,null],selectedPiece:null,whiteCanCastleQueenSide:r,whiteCanCastleKingSide:c,blackCanCastleQueenSide:d,blackCanCastleKingSide:u},(function(){s.setState({allPossibleMoves:s.getAllPossibleMoves(s.state,!0)},(function(){return h.a.post("https://polar-badlands-38570.herokuapp.com/getMove",{board:v(s.state.board)}).then((function(e){var t=parseInt(e.data.nextMove[0]),a=parseInt(e.data.nextMove[2]),n=s.state.board[[7-t,a]][0],i=parseInt(e.data.nextMove[4]),l=parseInt(e.data.nextMove[6]);s.setState({selected:[7-t,a],selectedPiece:n},(function(){s.makeMove(7-i,l)}))}))}))})):s.setState({board:o,sideToPlay:"white"==s.state.sideToPlay?"black":"white",selected:[null,null],selectedPiece:null,whiteCanCastleQueenSide:r,whiteCanCastleKingSide:c,blackCanCastleQueenSide:d,blackCanCastleKingSide:u},(function(){s.setState({allPossibleMoves:s.getAllPossibleMoves(s.state,!0)},(function(){w([],s.state.allPossibleMoves)&&alert("CHECKMATE")}))}))}}else s.setState({selected:[null,null],selectedPiece:null});else w(s.state.selected,[e,t])?s.setState({selected:[null,null],selectedPiece:null}):s.setState({selected:[e,t],selectedPiece:s.state.board[[e,t]][0]})};for(var n={},i=0;i<8;i++)n[[0,i]]=[y[i],"black"],n[[1,i]]=["pawn","black"],n[[2,i]]=[null,null],n[[3,i]]=[null,null],n[[4,i]]=[null,null],n[[5,i]]=[null,null],n[[6,i]]=["pawn","white"],n[[7,i]]=[y[i],"white"];s.state={selected:[null,null],board:n,sideToPlay:"white",selectedPiece:null,blackCanCastleQueenSide:!0,blackCanCastleKingSide:!0,whiteCanCastleQueenSide:!0,whiteCanCastleKingSide:!0};var l=s.getAllPossibleMoves(s.state,!0);return s.state.allPossibleMoves=l,s}return Object(r.a)(a,[{key:"render",value:function(){var e=this,t=this.getReachablePieces(this.state,!0);return Object(b.jsx)("div",{className:"App",children:Object(b.jsx)("div",{className:"Container",children:g.map((function(a){return Object(b.jsx)(f,{x:a[0],y:a[1],piece:e.state.board[a],sideToPlay:e.state.sideToPlay,makeMove:e.makeMove,selected:e.state.selected,selectedPiece:e.state.selectedPiece,reachable:A(t,[a[0],a[1]])})}))})})}}]),a}(n.a.Component),T=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,44)).then((function(t){var a=t.getCLS,s=t.getFID,n=t.getFCP,i=t.getLCP,l=t.getTTFB;a(e),s(e),n(e),i(e),l(e)}))};l.a.render(Object(b.jsx)(n.a.StrictMode,{children:Object(b.jsx)(S,{})}),document.getElementById("root")),T()}},[[43,1,2]]]);
//# sourceMappingURL=main.d02c8d03.chunk.js.map