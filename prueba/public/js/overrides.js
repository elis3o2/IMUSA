frappe.utils.guess_style = function (text, default_style, _colour) {
    var style = default_style || "default";
    var colour = "gray";
    if (text) {
        text = cstr(text);
        if (has_words(["Pending", "Review", "Medium", "Not Approved"], text)) {
            style = "warning";
            colour = "orange";
        } else if (
            has_words(["Open", "Urgent", "High", "Failed", "Rejected", "Error"], text)
        ) {
            style = "danger";
            colour = "red";
        } else if (
            has_words(
                [
                    "Closed",
                    "Finished",
                    "Converted",
                    "Completed",
                    "Complete",
                    "Confirmed",
                    "Approved",
                    "Yes",
                    "Active",
                    "Available",
                    "Paid",
                    "Success",
                ],
                text
            )
        ) {
            style = "success";
            colour = "green";
        } else if (has_words(["Submitted"], text)) {
            style = "info";
            colour = "blue";
        } else if (has_words(["Macho"], text)) {
            colour = "blue";
        }  else if (has_words(["Hembra"], text)) {
            colour = "pink";
        }  else if (has_words(["Si"], text)) {
            colour = "green";
        }  else if (has_words(["No"], text)) {
            colour = "red";
        }

    }  
    return _colour ? colour : style;
}


frappe.provide("frappe.views");


frappe.views.ListView = class CustomListView extends frappe.views.ListView {    
    get_column_html(col, doc) {
        if (col.type === "Status" || col.df?.options == "Workflow State") {
            let show_workflow_state = col.df?.options == "Workflow State";
            return `
                <div class="list-row-col hidden-xs ellipsis">
                    ${this.get_indicator_html(doc, show_workflow_state)}
                </div>
            `;
        }

        if (col.type === "Tag") {
            const tags_display_class = !this.tags_shown ? "hide" : "";
            let tags_html = doc._user_tags
                ? this.get_tags_html(doc._user_tags, 2, true)
                : '<div class="tags-empty">-</div>';
            return `
                <div class="list-row-col tag-col ${tags_display_class} hidden-xs ellipsis">
                    ${tags_html}
                </div>
            `;
        }

        const df = col.df || {};
        const label = df.label;
        const fieldname = df.fieldname;
        const link_title_fieldname = this.link_field_title_fields[fieldname];
        const value = doc[fieldname] || "";
        let value_display = link_title_fieldname
            ? doc[fieldname + "_" + link_title_fieldname] || value
            : value;

        let translated_doctypes = frappe.boot?.translated_doctypes || [];
        if (translated_doctypes.includes(df.options)) {
            value_display = __(value_display);
        }

        const format = () => {
            if (df.fieldtype === "Percent") {
                return `<div class="progress" style="margin: 0px;">
                        <div class="progress-bar progress-bar-success" role="progressbar"
                            aria-valuenow="${value}"
                            aria-valuemin="0" aria-valuemax="100" style="width: ${Math.round(value)}%;">
                        </div>
                    </div>`;
            } else {
                return frappe.format(value, df, null, doc);
            }
        };

        const field_html = () => {
            let html;
            let _value;
            let strip_html_required =
                df.fieldtype == "Text Editor" ||
                (df.fetch_from && ["Text", "Small Text"].includes(df.fieldtype));

            if (strip_html_required) {
                _value = strip_html(value_display);
            } else {
                _value =
                    typeof value_display === "string"
                        ? frappe.utils.escape_html(value_display)
                        : value_display;
            }

            if (df.fieldtype === "Rating") {
                let out_of_ratings = df.options || 5;
                _value = _value * out_of_ratings;
            }

            if (df.fieldtype === "Image") {
                html = df.options
                    ? `<img src="${doc[df.options]}"
                    style="max-height: 30px; max-width: 100%;">`
                    : `<div class="missing-image small">
                        ${frappe.utils.icon("restriction")}
                    </div>`;
            } else if (df.fieldtype === "Select") {

                let icon_html = "";
                if (_value === "Gato") {
                    icon_html = `<img src="/assets/prueba/images/cat.svg" style="height: 1em; margin-right: 4px;">`;
                } else if (_value === "Perro") {
                    icon_html = `<img src="/assets/prueba/images/dog.svg" style="height: 1em; margin-right: 4px;">`;
                }
            
                html = `<span class="filterable indicator-pill ${frappe.utils.guess_colour(
                    _value
                )} ellipsis"
                    data-filter="${fieldname},=,${value}">
                    ${icon_html}
                    <span class="ellipsis"> ${__(_value)} </span>
                </span>`;
            }    else if (df.fieldtype === "Link") {
                html = `<a class="filterable ellipsis"
                    data-filter="${fieldname},=,${value}">
                    ${_value}
                </a>`;
            } else if (frappe.model.html_fieldtypes.includes(df.fieldtype)) {
                html = `<span class="ellipsis">
                    ${_value}
                </span>`;
            } else {
                html = `<a class="filterable ellipsis"
                    data-filter="${fieldname},=,${frappe.utils.escape_html(value)}">
                    ${format()}
                </a>`;
            }

            return `<span class="ellipsis"
                title="${__(label)}: ${frappe.utils.escape_html(_value)}">
                ${html}
            </span>`;
        };

        const class_map = {
            Subject: "list-subject level",
            Field: "hidden-xs",
        };
        const css_class = [
            "list-row-col ellipsis",
            class_map[col.type],
            frappe.model.is_numeric_field(df) ? "text-right" : "",
        ].join(" ");

        let column_html;
        if (
            this.settings.formatters &&
            this.settings.formatters[fieldname] &&
            col.type !== "Subject"
        ) {
            column_html = this.settings.formatters[fieldname](value, df, doc);
        } else {
            column_html = {
                Subject: this.get_subject_element(doc, value_display).innerHTML,
                Field: field_html(),
            }[col.type];
        }

        return `
            <div class="${css_class}">
                ${column_html}
            </div>
        `;}
	reorder_listview_fields() {
		let fields_order = [];
		let fields = JSON.parse(this.list_view_settings.fields);

		// title field is fixed
		fields_order.push(this.columns[0]);
		this.columns.splice(0, 1);

		for (let fld in fields) {
			for (let col in this.columns) {
				let field = fields[fld];
				let column = this.columns[col];

				if (column.type == "Status" && field.fieldname == "status_field") {
					fields_order.push(column);
					break;
				} else if (column.type == "Field" && field.fieldname === column.df.fieldname) {
					fields_order.push(column);
					break;
				}
			}
		}
		if (this.doctype == "Animal" || this.doctype == "Veterinario"){		
			let nombrep = ({
				type: "Field",
				df: {
					label: "Nombre",
					fieldname: "nombrep",
				},
			});
			let apellidop = ({
				type: "Field",
				df: {
					label: "Apellido",
					fieldname: "apellidop",
				},
			});
			for (let i = 0; i < fields_order.length; i++) {
				if (fields_order[i].df.fieldname == "documentop") {
				  // Insertamos los nuevos elementos justo después
				  fields_order.splice(i + 1, 0, nombrep, apellidop);
				  break; // Salimos del loop para que solo lo haga una vez
				}
			}
	    
        }
		
        return fields_order;
		
	}

}



frappe.ui.AppsSwitcher = class CustomAppsSwitcher extends frappe.ui.AppsSwitcher {
        setup_app_switcher() {
        this.app_switcher_menu = $(".app-switcher-menu");
        if (frappe.user_roles.includes("Creador")){
            $(".app-switcher-dropdown").on("click", (e) => {
                this.toggle_app_menu();
                e.stopImmediatePropagation();
            });
        }
    }
}

// Guardamos la versión original del constructor
const OriginalChartWidget = frappe.widget.widget_factory.chart;

// Creamos una nueva función que hace lo mismo pero modifica el método deseado
frappe.widget.widget_factory.chart = function ChartWidgetOverride(opts) {
    // Creamos la instancia original
    const widget = new OriginalChartWidget(opts);

    // Sobrescribimos el método setup_filter_button
    widget.setup_filter_button = function () {
        console.log("Botón de filtro desactivado");
        return;
    };
   
    widget.set_chart_actions = function(){
        console.log("Botón de configuración desactivado");
        return;
    }

    return widget;
};


// Guardamos la versión original del constructor
const OriginalNumberCardWidget = frappe.widget.widget_factory.number_card;

// Creamos una nueva función que hace lo mismo pero modifica el método deseado
frappe.widget.widget_factory.number_card = function NumberCardWidgetOverride(opts) {
    // Creamos la instancia original
    const widget = new OriginalNumberCardWidget(opts);


    widget.set_card_actions = function(){
        console.log("Botón de configuración desactivado");
        return;
    }

    return widget;
};
