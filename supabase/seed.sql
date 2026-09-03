-- ============================================================================
-- Seed data
--
-- Loads the copy from src/lib/content.ts into the editable tables, so the admin
-- dashboard has something to manage. Safe to re-run: rows are matched on their
-- natural key and updated rather than duplicated.
--
-- Generated from content.ts — regenerate rather than hand-editing if the copy
-- in that file changes.
-- ============================================================================

-- Services
insert into services (slug, title, summary, description, deliverables, sort_order)
values ('web-development', 'Web Development', 'Modern websites designed to turn visitors into customers.', 'A website should do more than exist. We design and build fast, clear sites that load quickly, read well on a phone, and make the next step obvious — whether that step is a booking, an enquiry, or a purchase.', array['Business websites', 'Landing pages', 'Restaurant & café websites', 'Booking websites', 'E-commerce', 'Website redesign', 'Website maintenance'], 0)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  deliverables = excluded.deliverables,
  sort_order = excluded.sort_order;

insert into services (slug, title, summary, description, deliverables, sort_order)
values ('business-automation', 'Business Automation', 'Automate repetitive work and connect the tools your business already uses.', 'Most small teams lose hours every week to copying information between apps. We map the work you actually do, then build workflows that handle the repetitive parts — reliably, in the background, without anyone remembering to press a button.', array['n8n workflows', 'Booking automation', 'Email automation', 'Lead automation', 'CRM automation', 'LINE integrations', 'Google Sheets automation', 'AI-powered workflows'], 1)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  deliverables = excluded.deliverables,
  sort_order = excluded.sort_order;

insert into services (slug, title, summary, description, deliverables, sort_order)
values ('digital-solutions', 'Digital Solutions', 'Custom systems, dashboards and integrations built around your business.', 'When off-the-shelf software nearly fits but not quite, we build the missing piece. Dashboards that show what matters, databases that hold your customer history properly, and integrations that make separate tools behave like one system.', array['Custom dashboards', 'CRM systems', 'Internal business tools', 'Database systems', 'API integrations', 'AI integrations', 'Custom business systems'], 2)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  deliverables = excluded.deliverables,
  sort_order = excluded.sort_order;

insert into services (slug, title, summary, description, deliverables, sort_order)
values ('digital-support', 'Digital Support', 'Reliable support for websites, domains, hosting, email and digital systems.', 'Launch is the beginning, not the end. We keep the technical foundation steady — hosting, domains, business email, backups and security — so you can think about your business instead of your infrastructure.', array['Domain & DNS', 'Hosting', 'Business email', 'Website maintenance', 'Backup', 'Security', 'Technical support'], 3)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  deliverables = excluded.deliverables,
  sort_order = excluded.sort_order;


-- FAQ
create unique index if not exists faq_question_key on faq (question);

insert into faq (question, answer, sort_order)
values ('How much does a website cost?', 'It depends on what the site needs to do. A focused landing page and a multi-language restaurant site with online booking are very different pieces of work. We scope around the outcome first, then send a written proposal with a fixed figure, the deliverables and the milestones before anything starts.', 0)
on conflict (question) do update set
  answer = excluded.answer,
  sort_order = excluded.sort_order;

insert into faq (question, answer, sort_order)
values ('How long does a project take?', 'A focused website is usually three to six weeks from kickoff. A single automation workflow is often one to two weeks. Larger custom systems depend on how many tools have to be connected — we give you a dated timeline during the planning stage rather than an estimate at the end.', 1)
on conflict (question) do update set
  answer = excluded.answer,
  sort_order = excluded.sort_order;

insert into faq (question, answer, sort_order)
values ('Do you provide hosting?', 'Yes. We can set up and manage hosting, domains, DNS, business email, backups and SSL, either as part of the project or as a monthly support plan. If you would rather own the accounts directly, we will set everything up in your name and hand over access.', 2)
on conflict (question) do update set
  answer = excluded.answer,
  sort_order = excluded.sort_order;

insert into faq (question, answer, sort_order)
values ('Can you redesign an existing website?', 'Yes, and it is often the faster route. We can keep what already works — your content, your rankings, your domain — and rebuild the design, the mobile experience and the structure around it. We can also connect an existing site to new booking or follow-up workflows without rebuilding it.', 3)
on conflict (question) do update set
  answer = excluded.answer,
  sort_order = excluded.sort_order;

insert into faq (question, answer, sort_order)
values ('Can you automate my existing workflow?', 'Usually, yes. If the steps are repeatable and the tools involved have an API or a webhook — most modern ones do — it can generally be automated. We start by mapping how the work is done now, then automate the parts that are genuinely repetitive and leave the judgement calls to people.', 4)
on conflict (question) do update set
  answer = excluded.answer,
  sort_order = excluded.sort_order;

insert into faq (question, answer, sort_order)
values ('Can you integrate LINE?', 'Yes. LINE is how a lot of businesses actually talk to customers, so we treat it as a first-class channel. We can send booking confirmations and reminders to customers, push new enquiry notifications to your team, and connect LINE into the same workflow as your website and email.', 5)
on conflict (question) do update set
  answer = excluded.answer,
  sort_order = excluded.sort_order;

insert into faq (question, answer, sort_order)
values ('Do you provide ongoing support?', 'Yes. Monthly support plans cover maintenance, updates, backups, monitoring, hosting management and a set amount of improvement work. You can also come back for one-off changes without a plan — a plan simply makes response times and priorities predictable.', 6)
on conflict (question) do update set
  answer = excluded.answer,
  sort_order = excluded.sort_order;

insert into faq (question, answer, sort_order)
values ('Do I need technical knowledge?', 'No. That is the point of hiring us. We explain what we are proposing in plain terms, handle the technical setup ourselves, and hand over something you can operate without a manual. If part of the system needs your team to use it daily, we train them on it.', 7)
on conflict (question) do update set
  answer = excluded.answer,
  sort_order = excluded.sort_order;

insert into faq (question, answer, sort_order)
values ('Can you work with businesses remotely?', 'Yes. Most of our work runs over calls, email and LINE, with a shared preview link so you can see progress as it happens. Being in the same city is convenient but has never been a requirement.', 8)
on conflict (question) do update set
  answer = excluded.answer,
  sort_order = excluded.sort_order;

insert into faq (question, answer, sort_order)
values ('What happens after I submit a project request?', 'You get a confirmation email straight away so you know it arrived. We review the details and reply to arrange a short discovery call. After that call we send a written proposal covering scope, timeline and cost. Nothing is charged and nothing is committed until you approve that proposal.', 9)
on conflict (question) do update set
  answer = excluded.answer,
  sort_order = excluded.sort_order;

