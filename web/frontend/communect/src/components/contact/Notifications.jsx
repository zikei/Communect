import React from "react";
import { Toast, ToastContainer, Button } from "react-bootstrap";

async function handleNotificationReaction(postId, choiceId = null) {
  try {
    const response = await fetch(
      import.meta.env.VITE_API_URL + `/contact/${postId}/reaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ choiceId }),
      }
    );

    if (response.status === 200) {
      alert("リアクションが送信されました！");
    } else {
      throw new Error("リアクション送信に失敗しました。");
    }
  } catch (err) {
    alert(`エラー: ${err.message}`);
  }
}

function Notifications({ notifications, onRemoveNotification }) {
  return (
    <ToastContainer position="bottom-end" className="p-3">
      {notifications.map((notif, index) => (
        <Toast
          key={index}
          onClose={() => onRemoveNotification(notif.postId)}
          autohide
          delay={10000}
        >
          <Toast.Header>
            <strong className="me-auto">
              {notif.contactType === "INFORM"
                ? "周知連絡"
                : notif.contactType === "CONFIRM"
                ? "確認連絡"
                : notif.contactType === "CHOICE"
                ? "多肢連絡"
                : "不明な連絡タイプ"}
            </strong>
          </Toast.Header>
          <Toast.Body>
            <p>{notif.message || "メッセージがありません。"}</p>
            <div className="mt-2">
              {notif.contactType === "CONFIRM" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    await handleNotificationReaction(notif.postId, "👍");
                    onRemoveNotification(notif.postId);
                  }}
                >
                  👍 ＯＫ
                </Button>
              )}
              {notif.contactType === "CHOICE" &&
                Array.isArray(notif.choices) && (
                  <div>
                    {notif.choices.map((choiceObj, idx) => (
                      <Button
                        key={idx}
                        variant="secondary"
                        size="sm"
                        className="me-1"
                        onClick={async () => {
                          await handleNotificationReaction(
                            notif.postId,
                            choiceObj.choiceId
                          ); // choiceIdを利用
                          onRemoveNotification(notif.postId);
                        }}
                      >
                        {choiceObj.choice || "不明な選択肢"}{" "}
                        {/* choiceを表示 */}
                      </Button>
                    ))}
                  </div>
                )}
            </div>
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}

export default Notifications;
