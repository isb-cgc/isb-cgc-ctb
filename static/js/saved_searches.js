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
        let my_search_tbl = $('#saved_searches_tbl').DataTable({
            scrollX: true,
            ordering: false,
            ajax: {
                url: get_search_list_url,
                dataSrc: ''
            },
            columns: [
                {
                    class: 'text-end',
                    render: function (data, type, row, meta) {
                        let search_samples_url;
                        if (row.search_type == 'Biosample') {
                            search_samples_url = search_tissue_samples_url;
                        } else if (row.search_type == 'Clinical') {
                            search_samples_url = search_clinical_url;
                        } else {
                            search_samples_url = driver_search_facility_url;
                        }
                        let search_url =  search_samples_url + row.filter_encoded_url + '&title='+row.name;
                        return "<a href='" + search_url + "'>" + row.name + "</a>";
                    }
                },
                {
                    data: 'search_type',
                    class: 'text-end',
                },
                {
                    data: 'case_count',
                    type: 'num',
                    class: 'text-end',
                    render: $.fn.dataTable.render.number(',', null)
                },
                {
                    class: 'date-col text-end',
                    data: 'saved_date',
                    type: 'date'
                },
                {
                    class: 'text-center',
                    render: function (data, type, row, meta) {
                        return "<a class='delete-search-btn' href='#' data-filter-id='" + row.filter_id + "'><i class='fa-solid fa-trash-can'></i><span class=\"sr-only\">Delete</span></a>";
                    },
                },
            ]
        });
        $('#saved_searches_tbl tbody').on('click', '.delete-search-btn', function () {
            delete_filter($(this).data('filter-id'));
        });

        let delete_filter = function (filter_id) {
            $.ajax({
                type: "post",
                url: delete_filters_url.replace('0', filter_id),
                success: function (data) {
                    my_search_tbl.ajax.reload();
                    $('#delete_success_message').text('');
                    $('#delete_error_message').text('');
                    if (data.success) {
                        $('#delete_success_message').text(data.success);
                    } else {
                        $('#delete_error_message').text(data.error);
                    }
                }
            });
        };
    });
});