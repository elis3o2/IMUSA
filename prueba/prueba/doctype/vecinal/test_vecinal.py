# Copyright (c) 2025, Eliseo y Miguel and Contributors
# See license.txt

# import frappe
from frappe.tests import IntegrationTestCase, UnitTestCase


# On IntegrationTestCase, the doctype test records and all
# link-field test record dependencies are recursively loaded
# Use these module variables to add/remove to/from that list
EXTRA_TEST_RECORD_DEPENDENCIES = []  # eg. ["User"]
IGNORE_TEST_RECORD_DEPENDENCIES = []  # eg. ["User"]


class UnitTestVecinal(UnitTestCase):
	"""
	Unit tests for Vecinal.
	Use this class for testing individual functions and methods.
	"""

	pass


class IntegrationTestVecinal(IntegrationTestCase):
	"""
	Integration tests for Vecinal.
	Use this class for testing interactions between multiple components.
	"""

	pass
