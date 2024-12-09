use communect;
--test data
--user
--password=userName
insert into user (userId, userName, nickname, password, email, apikey)
    values('87c6e905-41d5-484f-b7e1-14eb874a50ad', 'user', 'ユーザー', ':$2y$05$KMtYOY1TKvjUviZyjR.NDu.1HmC7IXAN.Dgh3Yw5j7jQteqT.kMAO', 'user@user.com', 'user-api'),
          ('7b914ed7-b528-4236-8137-b0fa6c7b1cec', 'user2', 'ユーザー２', "$2y$05$q1m4UVdf3gd6BlfJGhWtru9Sfi00SDZOpXrE7ltyHbe/gcckdl3US", 'user2@user.com', 'user2-api'),
          ('da872c4c-570e-454e-a66d-a8a6a63e62f8', 'user3', 'ユーザー３', "$2y$05$uXICN/CBJh/0Y0rTXfGkCO.wObeZeADLSXeugC5ULHsEUBPIbOwXi", 'user3@user.com', 'user3-api'),
          ('5da26136-975a-43fc-9a96-098ce55f1066', 'user4', 'ユーザー４', '$2y$05$awPFx5lh.fs3aPNGe1Nw6O9Fs4WOnmCli5gQuujbYXx1iy1FvZHLW', 'user4@user.com', 'user4-api'),
          ('22ba2bbd-0ff7-4546-8f5d-e28ae38546d1', 'user5', 'ユーザー５', '$2y$05$txKbGvjO3brRsKqavsDawOAh68v2ww1E9eIArqPGxflQbIetRPcHW', 'user5@user.com', 'user5-api');

--talk
insert into talk (talkId, talkTitle, talkType)
    values('f9b4249f-15f9-4bba-a5f4-a68e061ead17', 'グループトーク１', 'GROUP'),
          ('f5e95348-ef09-498d-913b-1ea10495fd3a', 'グループトーク２', 'GROUP'),
          ('db4fe359-f5c1-4866-a900-5c8e6c23abbc', 'グループトーク３', 'GROUP'),
          ('3ff1b08a-5e59-4491-b274-78aef7e6f4b9', 'トーク１', 'INDIVIDUAL'),
          ('0dba78ba-e4a9-4012-8faa-3096ae993495', 'トーク２', 'INDIVIDUAL'),
          ('231c89f1-dd63-492e-bade-0e917f80fd2a', 'トーク３', 'INDIVIDUAL'),
          ('8fbf2f77-7323-4e61-9524-c612934b6884', 'トーク４', 'INDIVIDUAL'),
          ('e1e55b77-d242-4f46-ac6f-5d2b337f53b2', 'トーク５', 'INDIVIDUAL');

--notice_group
insert into notice_group (noticeGroupId, aboveId, groupTitle)
    values('176e28f1-fd68-4084-a91d-182a12aa0297', NULL, 'グループ'),
          ('b642d6fa-a719-45d2-929c-081e89384b94', NULL, 'グループ２'),
          ('eaab0304-42e7-473a-bada-539f8be3357a', '176e28f1-fd68-4084-a91d-182a12aa0297', '下位グループ');
          
--user_group
insert into user_group (userGroupId, noticeGroupId, userId, nickname, role, subGroupCreateAuthority, groupAdmin)
    values('c37efa37-87ba-4f2e-9982-27aa3a8e89c7', '176e28f1-fd68-4084-a91d-182a12aa0297', '87c6e905-41d5-484f-b7e1-14eb874a50ad', 'ユーザー', 'HIGH', '1', '1'),
          ('2a574290-5222-469e-9ef7-2fd5ebdb09de', '176e28f1-fd68-4084-a91d-182a12aa0297', '7b914ed7-b528-4236-8137-b0fa6c7b1cec', 'ユーザー２', 'MEDIUM', '0', '0'),
          ('3434547d-593d-402e-a57f-03a4334a52dc', 'eaab0304-42e7-473a-bada-539f8be3357a', 'da872c4c-570e-454e-a66d-a8a6a63e62f8', 'ユーザー３', 'HIGH', '1', '1'),
          ('a9c7413d-bcba-4ac1-bdc4-5cc7ea823a25', '176e28f1-fd68-4084-a91d-182a12aa0297', 'da872c4c-570e-454e-a66d-a8a6a63e62f8', 'ユーザー３', 'HIGH', '1', '0'),
          ('862e7df9-cb5a-4565-86ad-90dec746541d', 'b642d6fa-a719-45d2-929c-081e89384b94', '5da26136-975a-43fc-9a96-098ce55f1066', 'ユーザー４', 'LOW', '1', '1'),
          ('d2f3e338-7064-46c1-bb8f-5b2ab1d72651', 'eaab0304-42e7-473a-bada-539f8be3357a', '22ba2bbd-0ff7-4546-8f5d-e28ae38546d1', 'ユーザー５', 'MEDIUM', '0', '0'),
          ('99e44a4b-be55-46a3-904b-06969f483018', '176e28f1-fd68-4084-a91d-182a12aa0297', '22ba2bbd-0ff7-4546-8f5d-e28ae38546d1', 'ユーザー５', 'MEDIUM', '0', '0'),
          ('34f4ed7c-d53d-4d38-8ba9-c35c6f89727b', 'b642d6fa-a719-45d2-929c-081e89384b94', '87c6e905-41d5-484f-b7e1-14eb874a50ad', 'ユーザー', 'HIGH', '0', '1');

--group talk
insert into group_talk (talkId, noticeGroupId)
    values('f9b4249f-15f9-4bba-a5f4-a68e061ead17', '176e28f1-fd68-4084-a91d-182a12aa0297'),
          ('f5e95348-ef09-498d-913b-1ea10495fd3a', 'b642d6fa-a719-45d2-929c-081e89384b94'),
          ('db4fe359-f5c1-4866-a900-5c8e6c23abbc', 'eaab0304-42e7-473a-bada-539f8be3357a');

--individual_talk
insert into individual_talk (individualTalkId, talkId, userId)
    values('2ab69c18-3ece-46df-a2aa-c90f4ac2e289', '3ff1b08a-5e59-4491-b274-78aef7e6f4b9', '87c6e905-41d5-484f-b7e1-14eb874a50ad'),
          ('d358b2b5-574e-48ea-ae8f-7f77f77e6096', '3ff1b08a-5e59-4491-b274-78aef7e6f4b9', '7b914ed7-b528-4236-8137-b0fa6c7b1cec'),
          ('d4da8ee1-7627-4706-8674-6a5f8aabf367', '0dba78ba-e4a9-4012-8faa-3096ae993495', '7b914ed7-b528-4236-8137-b0fa6c7b1cec'),
          ('5398ec25-568f-49e9-94ea-88be9a53bfb5', '0dba78ba-e4a9-4012-8faa-3096ae993495', 'da872c4c-570e-454e-a66d-a8a6a63e62f8'),
          ('d6ea0a50-2605-4318-8e78-aac3c1a5e145', '231c89f1-dd63-492e-bade-0e917f80fd2a', 'da872c4c-570e-454e-a66d-a8a6a63e62f8'),
          ('ef620f40-1c21-43d5-af5c-8257e2788699', '231c89f1-dd63-492e-bade-0e917f80fd2a', '5da26136-975a-43fc-9a96-098ce55f1066'),
          ('5ea4114a-f78b-48f0-b920-3c5eeac093e7', '8fbf2f77-7323-4e61-9524-c612934b6884', '5da26136-975a-43fc-9a96-098ce55f1066'),
          ('6aca6816-7563-4a39-959e-e4a8023c4bee', '8fbf2f77-7323-4e61-9524-c612934b6884', '22ba2bbd-0ff7-4546-8f5d-e28ae38546d1'),
          ('89012244-b469-4a31-9b75-d6e79fcfb29e', 'e1e55b77-d242-4f46-ac6f-5d2b337f53b2', '22ba2bbd-0ff7-4546-8f5d-e28ae38546d1'),
          ('73f23682-cde8-4ad0-9c71-bdd77183df2e', 'e1e55b77-d242-4f46-ac6f-5d2b337f53b2', '87c6e905-41d5-484f-b7e1-14eb874a50ad');

--message
insert into message (messageId, talkId, userId, message, createTime)
    values('28cb2e0f-a489-48cc-a846-9206544c40aa', 'f9b4249f-15f9-4bba-a5f4-a68e061ead17', '87c6e905-41d5-484f-b7e1-14eb874a50ad', 'テストメッセージ', '2000-01-01 00:00:00'),
          ('bb9d9138-9626-431a-bcfe-83945664cdbc', '3ff1b08a-5e59-4491-b274-78aef7e6f4b9', '87c6e905-41d5-484f-b7e1-14eb874a50ad', '個人テストメッセージ', '2001-01-01 11:11:11');

--contact
insert into contact (contactId, noticeGroupId, message, contactType, importance, createTime)
    values('15f6e66b-09a1-4594-ac7f-8d731227cbcb', '176e28f1-fd68-4084-a91d-182a12aa0297', 'contactテストメッセージ', 'CHOICE', 'HIGH', '2000-01-01 00:00:00'),
          ('90bff2b5-43d3-4a50-a905-805d3139c42f', 'b642d6fa-a719-45d2-929c-081e89384b94', 'contactテストメッセージ グループ２', 'CONFIRM', 'MEDIUM', '2000-01-02 00:00:00'),
          ('73c6fa63-11f6-4499-9f04-27cc5b00de51', 'eaab0304-42e7-473a-bada-539f8be3357a', 'contactテストメッセージ 下位', 'INFORM', 'SAFE', '2010-01-01 00:00:00');

--reaction
insert into reaction (reactionId, contactId, userId, reactionTime)
    values('e2ee46b7-6ac8-425d-8a59-c9ca760de4f7', '15f6e66b-09a1-4594-ac7f-8d731227cbcb', '87c6e905-41d5-484f-b7e1-14eb874a50ad', '2000-01-01 00:02:53'),
          ('98847f47-10a2-4527-93a8-15bbaf9738bd', '90bff2b5-43d3-4a50-a905-805d3139c42f', '5da26136-975a-43fc-9a96-098ce55f1066', '2000-01-03 00:00:02'),
          ('e52b912a-e141-43f5-9cd5-cc9a8f6d6b24', '73c6fa63-11f6-4499-9f04-27cc5b00de51', '7b914ed7-b528-4236-8137-b0fa6c7b1cec', '2010-02-01 05:33:40');

--choicecontact
insert into choicecontact (choicecontactId, contactId, choices)
    values('2c975e3b-72f4-45c0-9a48-00765cbcc4df', '15f6e66b-09a1-4594-ac7f-8d731227cbcb', 'はい'),
    values('19ad33e9-a69d-4050-882f-2015b0901d0e', '15f6e66b-09a1-4594-ac7f-8d731227cbcb', 'いいえ');

--choicereaction
insert into choicereaction (reactionId, choiceContactId)
    values('834ade11-3c54-4288-97a1-61e0b209a55d', '2c975e3b-72f4-45c0-9a48-00765cbcc4df'),
    values('23605b06-6b2e-4eb0-b96a-8ecd50fd0e34', '19ad33e9-a69d-4050-882f-2015b0901d0e');