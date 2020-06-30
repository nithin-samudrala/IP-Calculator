function convert(){
    //'192.168.0.1'
    var ip=document.getElementById('IPAdress').value
    var hsbits=document.getElementById('hostBits').value
    var clas 
    var netId
    var hostId
    var firstIndex= ip.indexOf(".")
    var middleIndex=ip.indexOf(".",firstIndex+1)
    var lastIndex=ip. lastIndexOf(".")
    // console.log(firstIndex);
    // console.log(middleIndex);
    // console.log(ip.slice(0,firstIndex));
    // console.log(ip.slice(firstIndex+1,lastIndex));
    // console.log(ip.slice(lastIndex+1));
    var first=ip.slice(0,firstIndex);
    var second =ip.slice(firstIndex+1,middleIndex);
    var third= ip.slice(middleIndex+1,lastIndex);
    var fouth=ip.slice(lastIndex+1);
    // console.log(first,second,third,fouth);

    if(second<256 && third<256 && fouth<256){
        let private=false;
        
        if (first>223 && first<240){
            clas='D'
            
        }
        else if(first>191 && first<224){     //&& first<224
            clas='C'
            if(first==192 && second==168){
                private=true;
            }
            // netId=ip.slice(0,lastIndex+1)
            // netId=netId+0
            // hostId='0.0.0'
            // hostId+=ip.slice(lastIndex)
            // console.log(netId,hostId);
            // if(hsbits<16){
            //     hsbits=22
            // }
            
        }
        else if(first>127 && first<229 ){     //&& first<229
            clas='B'

            if(first==127 && second>15 && second<32 ){
                private=true;
            }
            // netId=ip.slice(0,middleIndex+1)
            // netId=netId+'0.0'
            // hostId='0.0'
            // hostId+=ip.slice(middleIndex)
            // console.log(netId,hostId);
        }
        else if(first>0 && first<127){     //&& first<224
            clas='A'
            if (clas ==10){

                private=true;
            }
            // netId=ip.slice(0,firstIndex+1)
            // netId=netId+'0.0.0'
            // hostId='0'
            // hostId+=ip.slice(firstIndex)
            // console.log(netId,hostId);
                
            
        }
        else{
            alert('Enter a valid IP adress');
            return false;
            
        }
        if(private){
            document.getElementById('pri').textContent="Yes"
        }
        else{
            document.getElementById('pri').textContent="N0"
        }
    }else{
        alert('Enter a valid IP adress');
        return false;

    }


    // alert(clas);
    var ipBin={};
    ipBin[1]=String("0000000"+parseInt(first,10).toString(2)).slice(-8);
    ipBin[2]=String("0000000"+parseInt(second,10).toString(2)).slice(-8);
    ipBin[3]=String("0000000"+parseInt(third,10).toString(2)).slice(-8);
    ipBin[4]=String("0000000"+parseInt(fouth,10).toString(2)).slice(-8);
    // console.log(ipBin);
    // console.log(typeof(ipBin));


    // subnetmask
    var hsCellNum=Math.ceil(hsbits/8)     //finding host cell
    var hsCellBin=ipBin[hsCellNum]
    var hsBitsNum=hsbits%8
    if(hsBitsNum==0){
        hsCellNum++
    }
    var hsmaskCellBin='';                  //adding 1's in host bit placess
    for(var i=1;i<9;i++){
        if(hsBitsNum>=i){
            hsmaskCellBin+="1";
        }else{
            hsmaskCellBin+="0";
        }
    }
    var hsmaskCellVal=parseInt(hsmaskCellBin,2)
    //console.log(hsCellBin[1]);


    //net& broadcast address
    var netCellBin="";
    var bcCellBin="";
    for(var i=1;i<=8;i++){
        if(hsmaskCellBin.substring(i-1,i)=="1"){
            // console.log(hsmaskCellBin.substring(i-1,i));
            // console.log(i);
            
            netCellBin+=hsCellBin[i-1]          //hsmaskCellBin.substr(i-i,1);
            bcCellBin+=hsCellBin[i-1]      //hsmaskCellBin.substr(i-i,1);
        }else{
            netCellBin+="0";
            bcCellBin+="1";
        }
    }
    // console.log('netCellBin',netCellBin);
    
    //combining every thing
    var mask="";
    var wildcard="";
    var maskBin="";
    var wildcardBin="";
    var netID="";
    var bcAddres="";
    var netIDBin="";
    var bcAddresBin="";
    var from="";
    var fromBin='';
    var to="";
    var toBin="";


    for(var i=1;i<=4;i++){
        if(hsCellNum>i) {
            //blocks before the important block.
            mask+="255";
            wildcard+='0';
            maskBin+="11111111";
            wildcardBin+="00000000";
            netIDBin+=ipBin[i];
            bcAddresBin+=ipBin[i];
            netID+=parseInt(ipBin[i],2);
            bcAddres+=parseInt(ipBin[i],2);
            from+=parseInt(ipBin[i],2);
            fromBin+=ipBin[i];
            to+=parseInt(ipBin[i],2);
            toBin+=ipBin[i];
        }else if (hsCellNum==i) {
            //the important block.
            mask+=hsmaskCellVal;
            wildcard+=255-parseInt(hsmaskCellVal,10)
            maskBin+=hsmaskCellBin;
            wildcardBin+=String("00000000"+parseInt(255-parseInt(hsmaskCellVal,10),10).toString(2)).slice(-8);
            netIDBin+=netCellBin;
            bcAddresBin+=bcCellBin;
            netID+=parseInt(netCellBin,2);
            bcAddres+=parseInt(bcCellBin,2);
            if(i==4) {                                         //hsbits>22
                from+=(parseInt(netCellBin,2)+1);
                fromBin+=String("00000000"+parseInt((parseInt(netCellBin,2)+1),10).toString(2)).slice(-8);
                to+=(parseInt(bcCellBin,2)-1);
                toBin+=String("00000000"+parseInt((parseInt(bcCellBin,2)-1),10).toString(2)).slice(-8);
            }else{
                from+=(parseInt(netCellBin,2));
                fromBin+=netCellBin;
                to+=(parseInt(bcCellBin,2));
                toBin+=bcCellBin;
            }
            // from+=(parseInt(netCellBin,2)+1);//parseInt(netCellBin,2);               //(parseInt(netCellBin,2)+1);
            // to+=(parseInt(bcCellBin,2)-1);//parseInt(bcCellBin,2);    //(parseInt(bcCellBin,2)-1);
        }else {
            //block after the important block.
            mask+=0;
            wildcard+=255
            maskBin+="00000000";
            wildcardBin+="11111111";
            netIDBin+="00000000";
            bcAddresBin+="11111111";
            netID+="0";
            bcAddres+="255";
            if(i==4){
                from+=1;
                fromBin+='00000001';
                to+=254;
                toBin+="11111110";
            }else{
                from+=0;
                fromBin+='00000000';
                to+=255;
                toBin+="11111111";
            }
            
        }    
        if(i<4){
            mask+=".";
            wildcard+=".";
            maskBin+=".";
            wildcardBin+=".";
            netIDBin+=".";
            bcAddresBin+=".";
            netID+=".";
            bcAddres+=".";
            from+=".";
            fromBin+='.';
            to+=".";
            toBin+='.';
        }
    }
    var ipbinary=''
    for (let i = 1; i <= 4; i++) {
        ipbinary+= ipBin[i];
        if(i<4){
            ipbinary+="."
        }
        
    }
    // console.log(ipbinary);
    
    // console.log('hi');
    var binip=document.getElementById('ipval')
    binip.textContent=ipbinary
    document.getElementById('class').textContent=clas
    var mas =document.getElementById('mask')
    mas.textContent=mask  
    var masbin =document.getElementById('maskBin')
    masbin.textContent=maskBin
    document.getElementById('netId').textContent=netID
    document.getElementById('netIdBin').textContent=netIDBin
    document.getElementById('bcAddres').textContent=bcAddres
    document.getElementById('bcAddresBin').textContent=bcAddresBin
    document.getElementById('from').textContent=from
    document.getElementById('to').textContent=to
    document.getElementById('fromBin').textContent=fromBin
    document.getElementById('toBin').textContent=toBin
    document.getElementById('wildcard').textContent=wildcard
    document.getElementById('wildcardBin').textContent=wildcardBin

    // console.log('mask       '+mask);
    // console.log('maskBin    '+maskBin);
    // console.log('netIDBin   '+netIDBin);
    // console.log('bcAddresBin'+bcAddresBin);
    // console.log('netID      '+netID);
    // console.log('bcAddres   '+bcAddres);
    // console.log(from);
    // console.log(to);
    return false;

}
