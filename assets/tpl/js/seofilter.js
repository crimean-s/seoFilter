seoFilterConfig = {
    depth: 2,
    slash_at_end: true,
    ignored: ['price']
};
// Set slider numbers
$(".filter-number").each(function() {
    var filter = $(".mse2_number_slider", this).data('number-filter'),
        re_str = "^(.*)\\/"+filter+"(-|=)(\\d{1,5}),(\\d{1,5})\\/(.*)?$",
        re = new RegExp(re_str),
        match_arr = document.location.pathname.match(re);

    if (match_arr) {
        min = match_arr[3], max = match_arr[4];
        $(".mse2-number-0", this).val(min); $(".mse2-number-1", this).val(max);
        $(mSearch2.options.slider, this).slider('values',0,min); // sets first handle (index 0)
        $(mSearch2.options.slider, this).slider('values',1,max); // sets second handle (index 1)
    }
});

// Set alias filter
mSearch2.Hash.set = function(vars) {
    var hash = '', hash_seo_alias = [], hash_seo_get = [];
    var hash_default = [];
    var vars_arr = [];
    var curr_path = $(mSearch2.options.wrapper).data('url');
    var vars_count = 0;
    var vars_alias_count = 0;

    for (var i in vars) {
        if (vars.hasOwnProperty(i)) {
            vars_arr = vars[i].toString().split(';');

            // built default hash
            hash_default.push(i + '=' + vars[i]);

            // built seo hash
            var alias = $("input[name='"+i+"'][value='"+vars[i]+"']").data("filter-alias");

            if(seoFilterConfig.ignored.indexOf(i) == -1) {
                vars_count++;
            }
            if (alias && vars_arr.length == 1) {
                vars_alias_count++;
                if(seoFilterConfig.slash_at_end) {
                    hash_seo_alias.push(alias + '/');
                }
                else {
                    hash_seo_alias.push('/' + alias);
                }
            }
            else {
                hash_seo_get.push(i + '=' + vars[i]);
            }
        }
    }

    if(vars_count <= seoFilterConfig.depth && vars_count == vars_alias_count) {
        hash = hash_seo_alias.join('') + (hash_seo_get.length == 0 ? '' : '?' + hash_seo_get.join('&'));
    }
    else {
        hash = hash_default.length == 0 ? '' : '?' + hash_default.join('&');
    }

    //debugger
    //window.location.assign(curr_path + hash);

    if (!this.oldbrowser()) {
        window.history.pushState({mSearch2: curr_path + hash}, '', curr_path + hash);
    }
    else {
        window.location.hash = hash;
    }
};