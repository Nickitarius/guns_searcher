function groupBy(key) {
  return function group(array) {
    return array.reduce((acc, obj) => {
      const property = obj['Base_event'][key];
      acc[property] = acc[property] || [];
      acc[property].push(obj);
      return acc;
    }, {});
  };
}

function compare(a, b) {
  if (a['Base_event']['Rank']<b['Base_event']['Rank']) {
    return -1;
  }
  if (a['Base_event']['Rank']<b['Base_event']['Rank']) {
    return 1;
  }
  // a должно быть равным b
  return 0;
}

function loadmusic(mus_arr){
    let audio = new Audio(`/sounds/sound/${mus_arr[0]}/file`);
    audio.autoplay = true;
    
    audio.onended = function(){
        console.log(audio.duration);
        mus_arr.remove(function(value,index){if (index==0) return true;})
        if (mus_arr.length>0){
            loadmusic(mus_arr);
        };
    };
    
    
}

const groupByGroup = groupBy('Message_Group')
var music = new Arr();
var last_time = new Date();
music.on('insert',function(event){
    if (music.length == event.items.length){
        loadmusic(music)    
    }
    
})
function start_event_update() {
    'use strict';
    let client_login = "ACDC";
    let passwd = '0000';
    $.ajax({
        type: 'GET',
        url: `/clients/client/1`,
        success: function(data_cl){
            let intervalID  = setInterval(function(){
            $.ajax({
                type: 'GET',
                url: `/base_events`,
                success: function(data_be){
                    //console.log(data_be);
                    	//console.log(data_be);
                        //console.log(JSON.stringify(data_cl['Groups']))
                        $.get(`/events`,                                  
                              {Groups:data_cl['Groups'],Timeout:data_cl['Timeout']},
                             function(data){
                                //console.log(data)
                                $('div.log table.list tr.tr_log').remove();
                                for (let event in data){
                                    data[event]['Base_event'] = data_be.find(el => el.Id==data[event]['Base_event']);
                                    console.log('bEvent',data[event]['Base_event']);
                                    $(`<tr id=${data[event]['Id']} class='tr_log'><td class='td_log'>${new Date(data[event]['DateTime']).toUTCString()}</td><td class='td_log'>${data[event]['Base_event']['Title']}</td><td class='td_accept'></td><td class='td_solve'></td></tr>`).insertAfter($('div.log table.list tr.info'));
                                    $(`div.log table.list tr#${data[event]['Id']} td.td_accept`).html(`<button class="accept" id=${data[event]['Id']}>${data[event]['Is_accept']}</button>`);
                                    $(`div.log table.list tr#${data[event]['Id']} button.accept`).bind('click',function(event){
                                        console.log('CLICK');
                                        $.ajax({
                                            type:'GET',
                                            url:`/events/event/${event.target.getAttribute('id')}`,
                                            success: function(ev_data){
                                                $.ajax({
                                                       type: 'POST',
                                                        url: `/events/updater/${event.target.getAttribute('id')}`,
                                                        data:{'Is_accept':ev_data['Is_accept'] ? 0 : 1},    
                                                        success: function(ev_data){
                                                            $(`div.log table.list tr#${ev_data['Id']} button.accept`).html(`${ev_data['Is_accept']}`);
                                                        }
                                                    });
                                                }
                                            
                                        });
                                        
        
                                        console.log('event clk',event);
                                        //event.target.html('true');
                                    });
                                    $(`div.log table.list tr#${data[event]['Id']} td.td_solve`).html(`<button class="solve" id=${data[event]['Id']}>${data[event]['Is_solve']}</button>`);
                                    $(`div.log table.list tr#${data[event]['Id']} button.solve`).bind('click',function(event){
                                        console.log('CLICK');
                                         $.ajax({
                                            type:'GET',
                                            url:`/events/event/${event.target.getAttribute('id')}`,
                                            success: function(ev_data){
                                                $.ajax({
                                                       type: 'POST',
                                                        url: `/events/updater/${event.target.getAttribute('id')}`,
                                                        data:{'Is_solve':ev_data['Is_solve'] ? 0 : 1},    
                                                        success: function(ev_data){
                                                            $(`div.log table.list tr#${ev_data['Id']} button.solve`).html(`${ev_data['Is_solve']}`);
                                                        }
                                                    });
                                                }
                                            
                                        });
                                     });
                                    let table = $('div.log table.list')
                                }
                                let date_cl = new Date();

                                console.log('Dt filtr ',data.filter(el => new Date(el['DateTime']) > last_time));
                                data = data.filter(el =>  new Date(el['DateTime']) > last_time)
                                let event_groups = groupByGroup(data);
                                console.log('groups',event_groups);
                                last_time = new Date(Math.max(...data.map(el => new Date(el['DateTime'])),last_time) );                                
                                let sound_arr = {};
                                for ( let group_name in event_groups){
                                    let min = Math.min.apply(null, event_groups[group_name].map(obj => obj['Base_event']['Rank']));
                                    console.log(min);                                    
                                    event_groups[group_name] = event_groups[group_name].filter(el => el['Base_event']['Rank']==min);
                                    console.log('rank ',event_groups);
                                    console.log('solve',event_groups[group_name].filter(el => el['Is_solve']==false));
                                    event_groups[group_name] = event_groups[group_name].filter(el => el['Is_solve']==false);
                                    console.log('acept',event_groups[group_name].filter(el => (el['Is_accept']==false) || (date_cl-new Date(el['DateTime'])>=el['Base_event']['Cooldown'])));
                                    event_groups[group_name] = event_groups[group_name].filter(el => (el['Is_accept']==false) || (date_cl-new Date(el['DateTime'])>=el['Base_event']['Cooldown']));
                                    
                                    if (sound_arr.hasOwnProperty(min)){
                                        sound_arr[min]=sound_arr[min].concat(event_groups[group_name].map(obj => obj['Base_event']['Sound']));
                                    }else{
                                       sound_arr[min] = event_groups[group_name].map(obj => obj['Base_event']['Sound'])
                                    }
                                    
                                }
                                console.log('sound',sound_arr)
                                
                                for (let rank in sound_arr){
                                    music.insert(sound_arr[rank]);
                                        
                                    
                                    }
                                
                            })
                        }
                    })
                },data_cl['Timeout']*1000)
        },
        dataType:'json'   
    });
    
};

$(document).ready(function() {
    start_event_update();
    
});
