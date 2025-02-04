use communect;
--test data
--user
--password=userName
INSERT INTO user
    VALUES ('22ba2bbd-0ff7-4546-8f5d-e28ae38546d1','user5','水本','$2y$05$txKbGvjO3brRsKqavsDawOAh68v2ww1E9eIArqPGxflQbIetRPcHW','user5@example.com','user5-api'),
           ('5da26136-975a-43fc-9a96-098ce55f1066','user4','高橋','$2y$05$awPFx5lh.fs3aPNGe1Nw6O9Fs4WOnmCli5gQuujbYXx1iy1FvZHLW','user4@example.com','user4-api'),
           ('7b914ed7-b528-4236-8137-b0fa6c7b1cec','user2','安増','$2y$05$q1m4UVdf3gd6BlfJGhWtru9Sfi00SDZOpXrE7ltyHbe/gcckdl3US','user2@example.com','user2-api'),
           ('87c6e905-41d5-484f-b7e1-14eb874a50ad','user','田中','$2y$05$KMtYOY1TKvjUviZyjR.NDu.1HmC7IXAN.Dgh3Yw5j7jQteqT.kMAO','user@example.com','user-api'),
           ('8f3b4db2-1eeb-48cc-bd5d-0dc488d3d702','user7','堀江','$2a$10$MU/ItTJdSLovMCql/R26hOv.fvwhRZA15FoPQFqE3SSPJig4woPqW','user7@example.com','4djO5LffnHBwtixUtUqdeTWXQ53CbR6KU3qH5ztEsXU'),
           ('da872c4c-570e-454e-a66d-a8a6a63e62f8','user3','村田','$2y$05$uXICN/CBJh/0Y0rTXfGkCO.wObeZeADLSXeugC5ULHsEUBPIbOwXi','user3@example.com','user3-api'),
           ('de31a2a7-4e86-45ab-81db-8c26668c4cf9','user6','矢野','$2a$10$98dyqjg5ywMZZTuEZxSstO0MMdpHW2Z2ea18gX5WpDlmOgu8bNIEa','user6@example.com','JPeoMFN5fVusom3IcJAlNxeUn-rPETAXldyxkCjPz5M');

--talk
INSERT INTO talk
    VALUES ('bae0206c-f98b-431a-9210-576b6f6d1a21','相談','GROUP'),
           ('c8705e35-88bb-448e-85df-710db87fb005','That\'s談','GROUP');

--notice_group
INSERT INTO notice_group
    VALUES ('5958d062-5a1c-41b2-a47a-2d0c8689fda6',NULL,'LOVELETTER'),
           ('05076a3b-4af1-49d1-a202-267e570f762c','5958d062-5a1c-41b2-a47a-2d0c8689fda6','勉強会'),
           ('26766be1-b117-4ac1-abbe-118d32463c5d','05076a3b-4af1-49d1-a202-267e570f762c','Kotlin'),
           ('34db0928-2866-43be-b026-6f3aec47b7ee','5958d062-5a1c-41b2-a47a-2d0c8689fda6','フロントエンド'),
           ('7786e15e-33ff-412b-bd7f-2e909e74f1a7','5958d062-5a1c-41b2-a47a-2d0c8689fda6','モバイル'),
           ('b7702d71-10c5-4b6b-b426-d3e783b3166a','05076a3b-4af1-49d1-a202-267e570f762c','react'),
           ('d56bb97e-6a0c-4cf7-bd6a-34fdbd478bb3','5958d062-5a1c-41b2-a47a-2d0c8689fda6','バックエンド'),
           ('f1b32b69-2b73-40da-b001-5884fc609b48','05076a3b-4af1-49d1-a202-267e570f762c','react_native');

--user_group
INSERT INTO user_group
    VALUES ('029eda4f-4e32-4945-9234-7d4e769e33b7','d56bb97e-6a0c-4cf7-bd6a-34fdbd478bb3','8f3b4db2-1eeb-48cc-bd5d-0dc488d3d702','堀江','NONE',0,0),
           ('061ca2d2-e786-43ce-b8be-f8a47cc69be0','26766be1-b117-4ac1-abbe-118d32463c5d','8f3b4db2-1eeb-48cc-bd5d-0dc488d3d702','堀江','NONE',0,0),
           ('09bbe31f-d4d4-4e3a-ac2c-d7bd55488aea','5958d062-5a1c-41b2-a47a-2d0c8689fda6','de31a2a7-4e86-45ab-81db-8c26668c4cf9',NULL,'NONE',0,0),
           ('1106a669-d207-43a0-9ebd-814f5cd13bc0','26766be1-b117-4ac1-abbe-118d32463c5d','5da26136-975a-43fc-9a96-098ce55f1066','高橋','NONE',0,0),
           ('116da0ae-a9f4-4eb9-932b-cf21a7074dbe','7786e15e-33ff-412b-bd7f-2e909e74f1a7','87c6e905-41d5-484f-b7e1-14eb874a50ad','田中','HIGH',1,1),
           ('201fc912-b9e0-4714-bf5d-c41e2ea2f688','f1b32b69-2b73-40da-b001-5884fc609b48','87c6e905-41d5-484f-b7e1-14eb874a50ad','田中','HIGH',1,1),
           ('2c2cd08f-d5f4-42be-9388-86ded084acba','7786e15e-33ff-412b-bd7f-2e909e74f1a7','7b914ed7-b528-4236-8137-b0fa6c7b1cec','安増','NONE',0,0),
           ('2cde22c3-2cad-435d-8be5-096f3663f628','05076a3b-4af1-49d1-a202-267e570f762c','de31a2a7-4e86-45ab-81db-8c26668c4cf9','矢野','NONE',0,0),
           ('3041a23e-dcaf-46f1-9183-38e15c836bca','05076a3b-4af1-49d1-a202-267e570f762c','8f3b4db2-1eeb-48cc-bd5d-0dc488d3d702','堀江','NONE',0,0),
           ('33c20700-e262-4f71-badf-33489139711b','34db0928-2866-43be-b026-6f3aec47b7ee','da872c4c-570e-454e-a66d-a8a6a63e62f8','村田','NONE',0,0),
           ('378fb826-4f65-4e74-8795-e4e4ab70b3a9','7786e15e-33ff-412b-bd7f-2e909e74f1a7','22ba2bbd-0ff7-4546-8f5d-e28ae38546d1','水本','NONE',0,0),
           ('3e85d97a-cb8f-489c-be50-788c635d2b7f','d56bb97e-6a0c-4cf7-bd6a-34fdbd478bb3','87c6e905-41d5-484f-b7e1-14eb874a50ad','田中','HIGH',1,1),
           ('3eae7041-c21c-445e-8117-66acae40d7f3','d56bb97e-6a0c-4cf7-bd6a-34fdbd478bb3','5da26136-975a-43fc-9a96-098ce55f1066','高橋','NONE',0,0),
           ('3fe4ea7b-5bed-4037-9f01-7074a3d087b8','f1b32b69-2b73-40da-b001-5884fc609b48','7b914ed7-b528-4236-8137-b0fa6c7b1cec','安増','NONE',0,0),
           ('4075daf0-f235-4b6e-93b6-59a1519c33eb','34db0928-2866-43be-b026-6f3aec47b7ee','87c6e905-41d5-484f-b7e1-14eb874a50ad','田中','HIGH',1,1),
           ('41e03132-70be-4073-a399-11b245299954','05076a3b-4af1-49d1-a202-267e570f762c','da872c4c-570e-454e-a66d-a8a6a63e62f8','村田','NONE',0,0),
           ('4646138d-18d8-4d73-a1d5-0e2c17d9dee0','5958d062-5a1c-41b2-a47a-2d0c8689fda6','87c6e905-41d5-484f-b7e1-14eb874a50ad',NULL,'HIGH',1,1),
           ('4f6def5b-c36f-45bc-b553-a8e35194660c','b7702d71-10c5-4b6b-b426-d3e783b3166a','de31a2a7-4e86-45ab-81db-8c26668c4cf9','矢野','NONE',0,0),
           ('66a32c60-32c1-42a7-9e7d-f4dada262d90','b7702d71-10c5-4b6b-b426-d3e783b3166a','da872c4c-570e-454e-a66d-a8a6a63e62f8','村田','NONE',0,0),
           ('6d2c8c55-ae24-4923-9fd3-4d97ef2e9f3c','5958d062-5a1c-41b2-a47a-2d0c8689fda6','8f3b4db2-1eeb-48cc-bd5d-0dc488d3d702',NULL,'NONE',0,0),
           ('71f381c9-5e61-4464-b833-7a2762bd3162','05076a3b-4af1-49d1-a202-267e570f762c','87c6e905-41d5-484f-b7e1-14eb874a50ad','田中','HIGH',1,1),
           ('75716afc-fcf1-4a3b-8810-2c93e1634cce','05076a3b-4af1-49d1-a202-267e570f762c','7b914ed7-b528-4236-8137-b0fa6c7b1cec','安増','NONE',0,0),
           ('7584287a-0dc6-481b-a063-add5c768274c','5958d062-5a1c-41b2-a47a-2d0c8689fda6','7b914ed7-b528-4236-8137-b0fa6c7b1cec',NULL,'NONE',0,0),
           ('843af267-c8cd-40b4-821a-7e6da53c215f','5958d062-5a1c-41b2-a47a-2d0c8689fda6','5da26136-975a-43fc-9a96-098ce55f1066',NULL,'NONE',0,0),
           ('8e2e4333-5819-4597-ba85-1325a147831d','34db0928-2866-43be-b026-6f3aec47b7ee','de31a2a7-4e86-45ab-81db-8c26668c4cf9','矢野','NONE',0,0),
           ('9a73f7fe-3cac-47dd-8214-b7d78c5f15b1','5958d062-5a1c-41b2-a47a-2d0c8689fda6','22ba2bbd-0ff7-4546-8f5d-e28ae38546d1',NULL,'NONE',0,0),
           ('ad58ccae-28cb-4546-81ed-de950bfca3f7','05076a3b-4af1-49d1-a202-267e570f762c','22ba2bbd-0ff7-4546-8f5d-e28ae38546d1','水本','NONE',0,0),
           ('b6966c59-5bfb-4bf4-9fa9-b6ab02acc98f','26766be1-b117-4ac1-abbe-118d32463c5d','87c6e905-41d5-484f-b7e1-14eb874a50ad','田中','HIGH',1,1),
           ('bbcdc0b6-d8b9-49ba-8114-9546a4302a69','b7702d71-10c5-4b6b-b426-d3e783b3166a','7b914ed7-b528-4236-8137-b0fa6c7b1cec','安増','NONE',0,0),
           ('c93f9a01-6e6c-4344-bd94-e3e234cfd956','f1b32b69-2b73-40da-b001-5884fc609b48','22ba2bbd-0ff7-4546-8f5d-e28ae38546d1','水本','NONE',0,0),
           ('cc38bf6e-3e88-4ea7-b35c-dd8e2cde7db7','b7702d71-10c5-4b6b-b426-d3e783b3166a','87c6e905-41d5-484f-b7e1-14eb874a50ad','田中','HIGH',1,1),
           ('cca3ba3c-bc61-4f85-a881-3d20730f381a','f1b32b69-2b73-40da-b001-5884fc609b48','da872c4c-570e-454e-a66d-a8a6a63e62f8','村田','NONE',0,0),
           ('d1df22fb-0b97-429c-9c1d-b5c9c440a782','05076a3b-4af1-49d1-a202-267e570f762c','5da26136-975a-43fc-9a96-098ce55f1066','高橋','NONE',0,0),
           ('d4c8a1f2-9d74-4760-ac8c-41ff66af79ac','5958d062-5a1c-41b2-a47a-2d0c8689fda6','da872c4c-570e-454e-a66d-a8a6a63e62f8',NULL,'NONE',0,0),
           ('dcf8722c-6d07-48eb-bb87-e524e8a8d52c','b7702d71-10c5-4b6b-b426-d3e783b3166a','22ba2bbd-0ff7-4546-8f5d-e28ae38546d1','水本','NONE',0,0);

--group talk
INSERT INTO group_talk
    VALUES ('c8705e35-88bb-448e-85df-710db87fb005','5958d062-5a1c-41b2-a47a-2d0c8689fda6');

--individual_talk
INSERT INTO individual_talk
    VALUES ('9a35d8c3-2149-4afa-8a6e-d62508bd2ae3','bae0206c-f98b-431a-9210-576b6f6d1a21','87c6e905-41d5-484f-b7e1-14eb874a50ad'),
           ('da580343-2da7-4a19-947a-361c98820d1e','bae0206c-f98b-431a-9210-576b6f6d1a21','7b914ed7-b528-4236-8137-b0fa6c7b1cec');

--message
INSERT INTO message
    VALUES ('50fad44b-e6e2-4b1c-9d7d-1bb0a5ee9335','c8705e35-88bb-448e-85df-710db87fb005','87c6e905-41d5-484f-b7e1-14eb874a50ad','今日晩御飯食べに行かない？','2025-02-03 16:07:24'),
           ('5d14c248-699e-4c3c-b8f8-a5968fbcc7a0','c8705e35-88bb-448e-85df-710db87fb005','7b914ed7-b528-4236-8137-b0fa6c7b1cec','いいよ。\n何処に行くと？','2025-02-03 16:07:56'),
           ('8e26bcf8-df96-485f-bb84-d9d37327d685','c8705e35-88bb-448e-85df-710db87fb005','5da26136-975a-43fc-9a96-098ce55f1066','俺、寿司がいい!!!!','2025-02-03 16:13:48'),
           ('df3b7b72-91df-4e0c-8c7c-cf26a6df5bf1','c8705e35-88bb-448e-85df-710db87fb005','da872c4c-570e-454e-a66d-a8a6a63e62f8','焼肉食べたい!!','2025-02-03 16:11:02'),
           ('e9ef4069-391f-44f6-b66d-4b3e70e60178','c8705e35-88bb-448e-85df-710db87fb005','87c6e905-41d5-484f-b7e1-14eb874a50ad','じゃあすたみな太郎にしよう！','2025-02-03 16:40:54');
--contact
INSERT INTO contact
    VALUES ('5bfbf03e-02a7-489a-8de0-45800359c7b6','5958d062-5a1c-41b2-a47a-2d0c8689fda6','87c6e905-41d5-484f-b7e1-14eb874a50ad','明日のミーティングは中止です。\n各自、作業を進めてください。','CONFIRM','HIGH','2025-01-31 18:20:26'),
           ('7c5ce66a-8889-479c-a28b-033422510aaf','5958d062-5a1c-41b2-a47a-2d0c8689fda6','87c6e905-41d5-484f-b7e1-14eb874a50ad','レクリエーションが開催されますが、多数決で行き先を決めたいので、投票をお願いします。','CHOICE','LOW','2025-01-31 18:19:06'),
           ('dae445f4-0032-4512-aa67-b7f572625bf0','5958d062-5a1c-41b2-a47a-2d0c8689fda6','87c6e905-41d5-484f-b7e1-14eb874a50ad','【予告】来月レクリエーションを開催予定です。詳細が決まり次第再度連絡を行います。','INFORM','SAFE','2025-02-03 17:33:04');

--reaction

--choicecontact
INSERT INTO choicecontact
  VALUES ('3b984a0a-0000-4c99-95c6-9892ae3a6c6d','7c5ce66a-8889-479c-a28b-033422510aaf','動物園'),
         ('730f0d62-1aef-405f-b396-155822a31cb9','7c5ce66a-8889-479c-a28b-033422510aaf','映画館'),
         ('917205dc-a03d-4771-ab77-f431a0b74c0e','7c5ce66a-8889-479c-a28b-033422510aaf','遊園地');
