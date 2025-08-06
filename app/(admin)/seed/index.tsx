// app/(admin)/seed/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import firestore, { doc, setDoc } from "@react-native-firebase/firestore";

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

  // Resource form state
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

  // Quiz form state
  const [pendingQuizzes, setPendingQuizzes] = useState<Quiz[]>([]);
  const [quizForm, setQuizForm] = useState<Omit<Quiz, "questions">>({
    id: "",
    resourceId: "",
    xpReward: 0,
  });
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  function addResource() {
    setPendingResources([...pendingResources, resForm]);
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
    setQuizQuestions([
      ...quizQuestions,
      {
        question: { en: "", ar: "" },
        options: { en: ["", ""], ar: ["", ""] },
        correctIndex: 0,
      },
    ]);
  }

  function addOption(qIndex: number) {
    setQuizQuestions((q) =>
      q.map((qq, i) =>
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

  async function seedAll() {
    const db = firestore();
    try {
      // Seed resources
      for (const r of pendingResources) {
        await setDoc(doc(db, "resources", r.id), r);
      }
      // Seed quizzes
      for (const q of pendingQuizzes) {
        await setDoc(doc(db, "quizzes", q.id), {
          ...q,
          questions: quizQuestions,
        });
      }
      Alert.alert("✅ Seeded to Firestore!");
      setPendingResources([]);
      setPendingQuizzes([]);
    } catch (e: any) {
      Alert.alert("❌ Error seeding:", e.message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.toggle}>
          <Button title="Resources" onPress={() => setStep("resources")} />
          <Button title="Quizzes" onPress={() => setStep("quizzes")} />
        </View>

        {step === "resources" ? (
          <>
            <Text style={styles.heading}>Add Resource</Text>

            <TextInput
              placeholder="ID"
              value={resForm.id}
              onChangeText={(id) => setResForm((f) => ({ ...f, id }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Media URL"
              value={resForm.mediaUrl}
              onChangeText={(mediaUrl) =>
                setResForm((f) => ({ ...f, mediaUrl }))
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Hazard Type"
              value={resForm.hazardType}
              onChangeText={(hazardType) =>
                setResForm((f) => ({ ...f, hazardType }))
              }
              style={styles.input}
            />
            <TextInput
              placeholder="XP Value"
              keyboardType="number-pad"
              value={String(resForm.xpValue)}
              onChangeText={(t) =>
                setResForm((f) => ({
                  ...f,
                  xpValue: parseInt(t, 10) || 0,
                }))
              }
              style={styles.input}
            />

            <Text style={styles.subheading}>Title (EN / AR)</Text>
            <TextInput
              placeholder="Title EN"
              value={resForm.title.en}
              onChangeText={(en) =>
                setResForm((f) => ({
                  ...f,
                  title: { ...f.title, en },
                }))
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Title AR"
              value={resForm.title.ar}
              onChangeText={(ar) =>
                setResForm((f) => ({
                  ...f,
                  title: { ...f.title, ar },
                }))
              }
              style={styles.input}
            />

            <Text style={styles.subheading}>Description (EN / AR)</Text>
            <TextInput
              placeholder="Desc EN"
              value={resForm.description.en}
              onChangeText={(en) =>
                setResForm((f) => ({
                  ...f,
                  description: { ...f.description, en },
                }))
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Desc AR"
              value={resForm.description.ar}
              onChangeText={(ar) =>
                setResForm((f) => ({
                  ...f,
                  description: { ...f.description, ar },
                }))
              }
              style={styles.input}
            />

            <Text style={styles.subheading}>Content (EN / AR)</Text>
            <TextInput
              placeholder="Content EN"
              multiline
              value={resForm.content.en}
              onChangeText={(en) =>
                setResForm((f) => ({
                  ...f,
                  content: { ...f.content, en },
                }))
              }
              style={[styles.input, { height: 80 }]}
            />
            <TextInput
              placeholder="Content AR"
              multiline
              value={resForm.content.ar}
              onChangeText={(ar) =>
                setResForm((f) => ({
                  ...f,
                  content: { ...f.content, ar },
                }))
              }
              style={[styles.input, { height: 80 }]}
            />

            <Button title="➕ Add to Pending Resources" onPress={addResource} />

            <Text style={styles.heading}>
              Pending Resources ({pendingResources.length})
            </Text>
            {pendingResources.map((r) => (
              <Text key={r.id} style={styles.listItem}>
                {r.id}
              </Text>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.heading}>Add Quiz</Text>

            <TextInput
              placeholder="ID"
              value={quizForm.id}
              onChangeText={(id) => setQuizForm((f) => ({ ...f, id }))}
              style={styles.input}
            />
            <TextInput
              placeholder="Resource ID"
              value={quizForm.resourceId}
              onChangeText={(resourceId) =>
                setQuizForm((f) => ({ ...f, resourceId }))
              }
              style={styles.input}
            />
            <TextInput
              placeholder="XP Reward"
              keyboardType="number-pad"
              value={String(quizForm.xpReward)}
              onChangeText={(t) =>
                setQuizForm((f) => ({
                  ...f,
                  xpReward: parseInt(t, 10) || 0,
                }))
              }
              style={styles.input}
            />

            <Text style={styles.subheading}>
              Questions ({quizQuestions.length})
            </Text>
            {quizQuestions.map((q, i) => (
              <View key={i} style={styles.questionBlock}>
                <Text style={{ fontWeight: "600" }}>Question {i + 1}</Text>
                <TextInput
                  placeholder="Q EN"
                  value={q.question.en}
                  onChangeText={(en) => {
                    const arr = [...quizQuestions];
                    arr[i].question.en = en;
                    setQuizQuestions(arr);
                  }}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Q AR"
                  value={q.question.ar}
                  onChangeText={(ar) => {
                    const arr = [...quizQuestions];
                    arr[i].question.ar = ar;
                    setQuizQuestions(arr);
                  }}
                  style={styles.input}
                />

                <Text style={styles.subheading}>Options EN</Text>
                {q.options.en.map((opt, oi) => (
                  <TextInput
                    key={oi}
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onChangeText={(text) => {
                      const arr = [...quizQuestions];
                      arr[i].options.en[oi] = text;
                      setQuizQuestions(arr);
                    }}
                    style={styles.input}
                  />
                ))}
                <Text style={styles.subheading}>Options AR</Text>
                {q.options.ar.map((opt, oi) => (
                  <TextInput
                    key={oi}
                    placeholder={`خيار ${oi + 1}`}
                    value={opt}
                    onChangeText={(text) => {
                      const arr = [...quizQuestions];
                      arr[i].options.ar[oi] = text;
                      setQuizQuestions(arr);
                    }}
                    style={styles.input}
                  />
                ))}
                <Button title="➕ Add Option" onPress={() => addOption(i)} />

                <Text style={styles.subheading}>Correct Index</Text>
                <TextInput
                  placeholder="e.g. 0"
                  keyboardType="number-pad"
                  value={String(q.correctIndex)}
                  onChangeText={(t) => {
                    const idx = parseInt(t, 10) || 0;
                    const arr = [...quizQuestions];
                    arr[i].correctIndex = idx;
                    setQuizQuestions(arr);
                  }}
                  style={styles.input}
                />
              </View>
            ))}

            <Button title="➕ Add Question" onPress={addQuestion} />

            <Button
              title="➕ Add Quiz to Pending"
              onPress={() => {
                setPendingQuizzes([
                  ...pendingQuizzes,
                  { ...quizForm, questions: quizQuestions },
                ]);
                setQuizForm({ id: "", resourceId: "", xpReward: 0 });
                setQuizQuestions([]);
              }}
            />

            <Text style={styles.heading}>
              Pending Quizzes ({pendingQuizzes.length})
            </Text>
            {pendingQuizzes.map((q) => (
              <Text key={q.id} style={styles.listItem}>
                {q.id}
              </Text>
            ))}
          </>
        )}

        <View style={{ marginVertical: 20 }}>
          <Button title="🚀 Seed All Pending to Firestore" onPress={seedAll} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  toggle: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  subheading: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  listItem: {
    padding: 4,
    backgroundColor: "#f0f0f0",
    marginVertical: 2,
    borderRadius: 3,
  },
  questionBlock: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    borderRadius: 4,
  },
});
