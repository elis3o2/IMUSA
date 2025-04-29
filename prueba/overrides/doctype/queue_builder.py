import frappe
from frappe.email.doctype.email_queue.email_queue import QueueBuilder as OriginalQueueBuilder
from frappe.email.email_body import get_email

class CustomQueueBuilder(OriginalQueueBuilder):
    def prepare_email_content(self):
        email_account = self.get_outgoing_email_account()
        mail = get_email(
            recipients=self.final_recipients(),
            sender=self.sender,
            subject=self.subject,
            formatted=self.email_html_content(),
            text_content=self.email_text_content(),
            attachments=self._attachments,
            reply_to=self.reply_to,
            cc=self.final_cc(),
            bcc=self.bcc,
            email_account=email_account,
            expose_recipients=self.expose_recipients,
            inline_images=self.inline_images,
            header=self.header,
            x_priority=self._x_priority,
        )

        mail.set_message_id(self.message_id, self.is_notification)
        if self.read_receipt:
            mail.msg_root["Disposition-Notification-To"] = self.sender
        if self.in_reply_to:
            mail.set_in_reply_to(self.in_reply_to)
        return mail


