import React, { useState } from "react";
import { View, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";
import { router } from "expo-router";

import Screen from "@/components/ui/Screen";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";

import { getApp } from "@react-native-firebase/app";
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
} from "@react-native-firebase/firestore";

type Resource = {
  id: string;
  mediaUrl: string;
  hazardType: string;
  xpValue: number;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  content: { en: string; ar: string };
};

type Question = {
  question: { en: string; ar: string };
  options: { en: string[]; ar: string[] };
  correctIndex: number;
};

type Quiz = {
  id: string;
  resourceId: string;
  xpReward: number;
  questions: Question[];
};

export default function AdminSeedScreen() {
  const [step, setStep] = useState<"resources" | "quizzes">("resources");

  const [pendingResources, setPendingResources] = useState<Resource[]>([]);
  const [resForm, setResForm] = useState<Resource>({
    id: "",
    mediaUrl: "",
    hazardType: "",
    xpValue: 0,
    title: { en: "", ar: "" },
    description: { en: "", ar: "" },
    content: { en: "", ar: "" },
  });

  const [pendingQuizzes, setPendingQuizzes] = useState<Quiz[]>([]);
  const [quizForm, setQuizForm] = useState<Omit<Quiz, "questions">>({
    id: "",
    resourceId: "",
    xpReward: 0,
  });
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  function addResource() {
    if (!resForm.id.trim()) {
      alert("Resource needs an ID");
      return;
    }
    setPendingResources((prev) => [...prev, resForm]);
    setResForm({
      id: "",
      mediaUrl: "",
      hazardType: "",
      xpValue: 0,
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      content: { en: "", ar: "" },
    });
  }

  function addQuestion() {
    setQuizQuestions((prev) => [
      ...prev,
      {
        question: { en: "", ar: "" },
        options: { en: ["", ""], ar: ["", ""] },
        correctIndex: 0,
      },
    ]);
  }

  function addOption(qIndex: number) {
    setQuizQuestions((prev) =>
      prev.map((qq, i) =>
        i === qIndex
          ? {
              ...qq,
              options: {
                en: [...qq.options.en, ""],
                ar: [...qq.options.ar, ""],
              },
            }
          : qq
      )
    );
  }

  function validateQuiz(q: Quiz): string | null {
    if (!q.id.trim()) return "Quiz needs an ID.";
    if (!q.resourceId.trim()) return "Quiz needs a resourceId.";
    if (!q.questions.length) return "Quiz must have at least one question.";

    for (let i = 0; i < q.questions.length; i++) {
      const qi = q.questions[i];
      if (!qi.question.en.trim() || !qi.question.ar.trim())
        return `Question ${i + 1} needs EN/AR text.`;
      if (qi.options.en.length < 2 || qi.options.ar.length < 2)
        return `Question ${i + 1} needs at least 2 options in EN/AR.`;
      if (qi.options.en.length !== qi.options.ar.length)
        return `Question ${i + 1} options count must match EN/AR.`;
      if (qi.correctIndex < 0 || qi.correctIndex >= qi.options.en.length)
        return `Question ${i + 1} has an out-of-range correctIndex.`;
    }
    return null;
  }

  async function seedAll() {
    const app = getApp();
    const db = getFirestore(app);
    const batch = writeBatch(db);

    try {
      // Resources
      for (const r of pendingResources) {
        const ref = doc(collection(db, "resources"), r.id);
        batch.set(ref, r, { merge: true });
      }

      // Quizzes
      for (const q of pendingQuizzes) {
        const err = validateQuiz(q);
        if (err) {
          alert(`Invalid quiz "${q.id}": ${err}`);
          return;
        }
        const ref = doc(collection(db, "quizzes"), q.id);
        batch.set(ref, q, { merge: true });
      }

      await batch.commit();

      alert("✅ Seeded to Firestore!");
      setPendingResources([]);
      setPendingQuizzes([]);
    } catch (e: any) {
      alert(`❌ Error seeding: ${e?.message ?? String(e)}`);
    }
  }

  function goBack() {
    router.navigate("/(tabs)/settings");
  }

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Card style={styles.switcher}>
            <View style={styles.toggleRow}>
              <Button
                title="Resources"
                onPress={() => setStep("resources")}
                variant={step === "resources" ? "primary" : "secondary"}
              />
              <Button
                title="Quizzes"
                onPress={() => setStep("quizzes")}
                variant={step === "quizzes" ? "primary" : "secondary"}
              />
            </View>
          </Card>

          {step === "resources" ? (
            <Card>
              <Text variant="title" style={styles.heading}>
                Add Resource
              </Text>
              <Divider />

              <LabeledInput
                label="ID"
                value={resForm.id}
                onChangeText={(id) => setResForm((f) => ({ ...f, id }))}
              />
              <LabeledInput
                label="Media URL"
                value={resForm.mediaUrl}
                onChangeText={(mediaUrl) =>
                  setResForm((f) => ({ ...f, mediaUrl }))
                }
              />
              <LabeledInput
                label="Hazard Type"
                value={resForm.hazardType}
                onChangeText={(hazardType) =>
                  setResForm((f) => ({ ...f, hazardType }))
                }
              />
              <LabeledInput
                label="XP Value"
                keyboardType="number-pad"
                value={String(resForm.xpValue)}
                onChangeText={(t) =>
                  setResForm((f) => ({
                    ...f,
                    xpValue: parseInt(t, 10) || 0,
                  }))
                }
              />

              <Text variant="subtitle" style={styles.subheading}>
                Title (EN / AR)
              </Text>
              <LabeledInput
                label="Title EN"
                value={resForm.title.en}
                onChangeText={(en) =>
                  setResForm((f) => ({ ...f, title: { ...f.title, en } }))
                }
              />
              <LabeledInput
                label="Title AR"
                value={resForm.title.ar}
                onChangeText={(ar) =>
                  setResForm((f) => ({ ...f, title: { ...f.title, ar } }))
                }
              />

              <Text variant="subtitle" style={styles.subheading}>
                Description (EN / AR)
              </Text>
              <LabeledInput
                label="Desc EN"
                value={resForm.description.en}
                onChangeText={(en) =>
                  setResForm((f) => ({
                    ...f,
                    description: { ...f.description, en },
                  }))
                }
              />
              <LabeledInput
                label="Desc AR"
                value={resForm.description.ar}
                onChangeText={(ar) =>
                  setResForm((f) => ({
                    ...f,
                    description: { ...f.description, ar },
                  }))
                }
              />

              <Text variant="subtitle" style={styles.subheading}>
                Content (EN / AR)
              </Text>
              <LabeledInput
                label="Content EN"
                multiline
                value={resForm.content.en}
                onChangeText={(en) =>
                  setResForm((f) => ({
                    ...f,
                    content: { ...f.content, en },
                  }))
                }
                inputStyle={{ height: 100 }}
              />
              <LabeledInput
                label="Content AR"
                multiline
                value={resForm.content.ar}
                onChangeText={(ar) =>
                  setResForm((f) => ({
                    ...f,
                    content: { ...f.content, ar },
                  }))
                }
                inputStyle={{ height: 100 }}
              />

              <Button
                title="➕ Add to Pending Resources"
                onPress={addResource}
              />

              <Text variant="subtitle" style={styles.heading}>
                Pending Resources ({pendingResources.length})
              </Text>
              {pendingResources.map((r) => (
                <Text key={r.id} style={styles.listItem}>
                  {r.id}
                </Text>
              ))}
            </Card>
          ) : (
            <Card>
              <Text variant="title" style={styles.heading}>
                Add Quiz
              </Text>
              <Divider />

              <LabeledInput
                label="ID"
                value={quizForm.id}
                onChangeText={(id) => setQuizForm((f) => ({ ...f, id }))}
              />
              <LabeledInput
                label="Resource ID"
                value={quizForm.resourceId}
                onChangeText={(resourceId) =>
                  setQuizForm((f) => ({ ...f, resourceId }))
                }
              />
              <LabeledInput
                label="XP Reward"
                keyboardType="number-pad"
                value={String(quizForm.xpReward)}
                onChangeText={(t) =>
                  setQuizForm((f) => ({
                    ...f,
                    xpReward: parseInt(t, 10) || 0,
                  }))
                }
              />

              <Text variant="subtitle" style={styles.subheading}>
                Questions ({quizQuestions.length})
              </Text>

              {quizQuestions.map((q, i) => (
                <Card key={i} style={styles.questionBlock}>
                  <Text variant="subtitle">Question {i + 1}</Text>
                  <Divider />

                  <LabeledInput
                    label="Q EN"
                    value={q.question.en}
                    onChangeText={(en) => {
                      const arr = [...quizQuestions];
                      arr[i] = {
                        ...arr[i],
                        question: { ...arr[i].question, en },
                      };
                      setQuizQuestions(arr);
                    }}
                  />
                  <LabeledInput
                    label="Q AR"
                    value={q.question.ar}
                    onChangeText={(ar) => {
                      const arr = [...quizQuestions];
                      arr[i] = {
                        ...arr[i],
                        question: { ...arr[i].question, ar },
                      };
                      setQuizQuestions(arr);
                    }}
                  />

                  <Text variant="subtitle" style={styles.subheading}>
                    Options EN
                  </Text>
                  {q.options.en.map((opt, oi) => (
                    <LabeledInput
                      key={`en-${oi}`}
                      label={`Option ${oi + 1}`}
                      value={opt}
                      onChangeText={(text) => {
                        const arr = [...quizQuestions];
                        const en = [...arr[i].options.en];
                        en[oi] = text;
                        arr[i] = {
                          ...arr[i],
                          options: { ...arr[i].options, en },
                        };
                        setQuizQuestions(arr);
                      }}
                    />
                  ))}

                  <Text variant="subtitle" style={styles.subheading}>
                    Options AR
                  </Text>
                  {q.options.ar.map((opt, oi) => (
                    <LabeledInput
                      key={`ar-${oi}`}
                      label={`خيار ${oi + 1}`}
                      value={opt}
                      onChangeText={(text) => {
                        const arr = [...quizQuestions];
                        const ar = [...arr[i].options.ar];
                        ar[oi] = text;
                        arr[i] = {
                          ...arr[i],
                          options: { ...arr[i].options, ar },
                        };
                        setQuizQuestions(arr);
                      }}
                    />
                  ))}

                  <Button title="➕ Add Option" onPress={() => addOption(i)} />

                  <LabeledInput
                    label="Correct Index (0-based)"
                    keyboardType="number-pad"
                    value={String(q.correctIndex)}
                    onChangeText={(t) => {
                      const idx = parseInt(t, 10) || 0;
                      const arr = [...quizQuestions];
                      arr[i] = { ...arr[i], correctIndex: idx };
                      setQuizQuestions(arr);
                    }}
                  />
                </Card>
              ))}

              <Button
                style={styles.marginBottom}
                title="➕ Add Question"
                onPress={addQuestion}
              />

              <Button
                title="➕ Add Quiz to Pending"
                onPress={() => {
                  const newQuiz: Quiz = {
                    id: quizForm.id.trim(),
                    resourceId: quizForm.resourceId.trim(),
                    xpReward: quizForm.xpReward,
                    questions: quizQuestions,
                  };

                  const err = validateQuiz(newQuiz);
                  if (err) {
                    alert(err);
                    return;
                  }

                  setPendingQuizzes((prev) => [...prev, newQuiz]);
                  setQuizForm({ id: "", resourceId: "", xpReward: 0 });
                  setQuizQuestions([]);
                }}
              />

              <Text variant="subtitle" style={styles.heading}>
                Pending Quizzes ({pendingQuizzes.length})
              </Text>
              {pendingQuizzes.map((q) => (
                <Text key={q.id} style={styles.listItem}>
                  {q.id}
                </Text>
              ))}
            </Card>
          )}

          <View style={{ height: 12 }} />
          <Button title="🚀 Seed All Pending to Firestore" onPress={seedAll} />
          <View style={{ height: 12 }} />
          <Button title="Go back" variant="secondary" onPress={goBack} />
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

function LabeledInput({
  label,
  inputStyle,
  ...props
}: {
  label: string;
  inputStyle?: any;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text variant="caption" style={{ marginBottom: 4 }}>
        {label}
      </Text>
      <TextInput
        {...props}
        style={[styles.input, inputStyle]}
        placeholderTextColor="#888"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  switcher: { padding: 12 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  heading: { marginVertical: 8 },
  subheading: { marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#4444",
    padding: 10,
    borderRadius: 10,
  },
  listItem: {
    paddingVertical: 6,
    opacity: 0.8,
  },
  questionBlock: {
    marginTop: 10,
    padding: 12,
  },
  marginBottom: { marginBottom: 20 },
});
