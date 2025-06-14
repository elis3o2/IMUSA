app_name = "prueba"
app_title = "IMUSA"
app_publisher = "Eliseo y Miguel"
app_description = "castraciones"
app_email = "prueba@gmail.com"
app_license = "mit"


override_whitelisted_methods = {
    "frappe.desk.reportview.get": "prueba.overrides.methods.reportview.custom_get",
}

# For type-checking
export_python_type_annotations = True

page_js = {"print" : "public/js/print.js"}
# hooks.py
doctype_js = {"User": "public/js/user.js"}

doctype_list_js = {"User" : "public/js/user_list.js"}

app_include_js = ["/assets/prueba/js/overrides.js"]

app_include_css = ["/assets/prueba/css/css_variables.css"]

permission_query_conditions = {
    "User": "prueba.overrides.doctype.user.get_permission_query_conditions"
}


doc_events = {
    "Rescate": {
        "on_update": "prueba.imusa.doctype.rescate.event.on_update"
    }
}


after_migrate=["prueba.patches.make_creador.execute",
            "prueba.patches.workspace_u.execute",
            "prueba.patches.workspaces.execute",
            "prueba.patches.clean_navbar.execute"]

##def override_queuebuilder():
##    import frappe.email.doctype.email_queue.email_queue
##    from prueba.overrides.doctype.queue_builder import CustomQueueBuilder
##    frappe.email.doctype.email_queue.email_queue.QueueBuilder = CustomQueueBuilder

# Ejecutar el override al cargar el sistema
#override_queuebuilder()
def override_DatabaseQuery():
    import frappe.model.db_query
    from prueba.patches.database import CustomDatabaseQuery
    frappe.model.db_query.DatabaseQuery.build_and_run = CustomDatabaseQuery.build_and_run

override_DatabaseQuery()


fixtures = [
    {
        "doctype": "Custom DocPerm"
    }
]
# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "prueba",
# 		"logo": "/assets/prueba/logo.png",
# 		"title": "IMUSA",
# 		"route": "/prueba",
# 		"has_permission": "prueba.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/prueba/css/prueba.css"
# app_include_js = "/assets/prueba/js/prueba.js"

# include js, css files in header of web template
# web_include_css = "/assets/prueba/css/prueba.css"
# web_include_js = "/assets/prueba/js/prueba.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "prueba/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "prueba/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# automatically load and sync documents of this doctype from downstream apps
# importable_doctypes = [doctype_1]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "prueba.utils.jinja_methods",
# 	"filters": "prueba.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "prueba.install.before_install"
# after_install = "prueba.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "prueba.uninstall.before_uninstall"
# after_uninstall = "prueba.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "prueba.utils.before_app_install"
# after_app_install = "prueba.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "prueba.utils.before_app_uninstall"
# after_app_uninstall = "prueba.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "prueba.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"prueba.tasks.all"
# 	],
# 	"daily": [
# 		"prueba.tasks.daily"
# 	],
# 	"hourly": [
# 		"prueba.tasks.hourly"
# 	],
# 	"weekly": [
# 		"prueba.tasks.weekly"
# 	],
# 	"monthly": [
# 		"prueba.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "prueba.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "prueba.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "prueba.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["prueba.utils.before_request"]
# after_request = ["prueba.utils.after_request"]

# Job Events
# ----------
# before_job = ["prueba.utils.before_job"]
# after_job = ["prueba.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"prueba.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

