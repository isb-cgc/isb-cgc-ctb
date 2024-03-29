/**
 *
 * Copyright 2023, Institute for Systems Biology
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

require.config({
    baseUrl: STATIC_FILES_URL+'js/',
    paths: {
        base: 'base',
        'datatables.net': 'lib/datatables.min',
        'datatables.bootstrap': 'lib/dataTables.bootstrap5.min',
    },
    shim: {
        'datatables.net': ['base'],
        'datatables.bootstrap': ['base']
    }
});

require([
    'base',
    'datatables.net',
    'datatables.bootstrap'
], function(base) {
    $(document).ready(function () {

        let queryString = window.location.search;
        if (queryString){
            const urlParams = new URLSearchParams(queryString);
            for(const [key, value] of urlParams.entries()){
                if(key == 'title'){
                    $('#general-message').attr('data-title',value);
                }
                else if(key.endsWith('[]')) {
                    $("input:checkbox[name='" + key + "'][value='" + value + "']").prop('checked', true);
                }
                else if (key.startsWith('age')){
                    $(":input[type='number'][name='"+key+"']").val(value);
                }
                else{
                    $("input:radio[name='"+key+"'][value='"+value+"']").prop('checked', true);
                }
            }
        }

        search_samples();

        $("#search-tissue-filters input").not("#search-save-title").on("change", function () {
            search_samples();
        });
        // $(window).off('beforeunload.windowReload');
    });
    window.onbeforeunload = function () {
        // overwrite onbeforeunload, so it does not trigger warnings for dirty forms when
        // leaving the page
        // blank function do nothing
    }
    let search_samples = function () {
        let form_inputs = $("input.form-check-input:checkbox, input.form-check-input:radio, button.btn-reset, :input[type='number']");
        $('#total-input').val('');
        $('#total-case-count').text(numberWithCommas(0));
        $('table.table').addClass('loading');
        $("#make-app-btn, #clinical-search-facility-btn, #search-save-btn").addClass('disabled')
        $.ajax({
            type: "post",
            url: filter_tissue_samples_url,
            data: $('#search-tissue-form').serialize(),
            beforeSend: function(){
                form_inputs.attr("disabled", true);
            },
            success: function (case_counts) {
                $("#make-app-btn, #clinical-search-facility-btn, #search-save-btn").removeClass('disabled');
                $('table.table.loading').removeClass('loading');
                form_inputs.attr("disabled", false);
                $('#total-case-count').text(numberWithCommas(case_counts['total']));
                $('#total-input').val(case_counts['total']);
                $('#tissue-rna-normal').text(numberWithCommas(case_counts['tissue']['rna']['normal']));
                $('#tissue-rna-tumour').text(numberWithCommas(case_counts['tissue']['rna']['tumour']));
                $('#tissue-rna-metastatic').text(numberWithCommas(case_counts['tissue']['rna']['metastatic']));
                $('#tissue-dna-normal').text(numberWithCommas(case_counts['tissue']['dna']['normal']));
                $('#tissue-dna-tumour').text(numberWithCommas(case_counts['tissue']['dna']['tumour']));
                $('#tissue-dna-metastatic').text(numberWithCommas(case_counts['tissue']['dna']['metastatic']));
                $('#tissue-ffpe-normal').text(numberWithCommas(case_counts['tissue']['ffpe']['normal']));
                $('#tissue-ffpe-tumour').text(numberWithCommas(case_counts['tissue']['ffpe']['tumour']));
                $('#tissue-ffpe-metastatic').text(numberWithCommas(case_counts['tissue']['ffpe']['metastatic']));
                $('#blood-serum').text(numberWithCommas(case_counts['blood']['serum']));
                $('#blood-dna').text(numberWithCommas(case_counts['blood']['dna']));
                $('#blood-blood').text(numberWithCommas(case_counts['blood']['blood']));

                $('#clinical-search-facility-btn').attr('href', clinical_search_facility_url+"?" + $('#search-tissue-form').serialize())
                $('#general-message').html($('#general-message').data('title')?"<div role=\"alert\" class=\"alert alert-primary alert-dismissible fade show fst-italic\"><i class=\"fas fa-check-circle\"></i> Search '"+$('#general-message').data('title')+"' is loaded<button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button></div>":"")

            }
        });
    };
});
