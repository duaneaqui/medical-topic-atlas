export const patientUnits = [
  {
    id: "MB",
    index: "13",
    title: "Mother-Baby",
    unit: "Maternal / Neonatal",
    image: `${import.meta.env.BASE_URL}assets/patient-units/pu-unit-mb-mother-baby.png`,
    topics: [
      {
        id: "mb-pregnancy",
        title: "Pregnancy",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-mb-pregnancy.png`,
        cards: [
          { id: "mb-mb-00-pregnancy", code: "MB 00", short: "ANTE", title: "Pregnancy", faces: 5 }
        ]
      },
      {
        id: "mb-labor-delivery",
        title: "L&D",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-mb-labor-delivery.png`,
        cards: [
          { id: "mb-mb-00-labor-delivery", code: "MB 00", short: "L&D", title: "Labor and Delivery", faces: 5 }
        ]
      },
      {
        id: "mb-obstetrical-issues",
        title: "Obstetrical Issues",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-mb-obstetrical-issues.png`,
        cards: [
          { id: "mb-mb-01-gestational-issues", code: "MB 01", short: "GS", title: "Gestational Issues", faces: 2 },
          { id: "mb-mb-02-fetal-malpositions", code: "MB 02", short: "FET", title: "Fetal Malpositions", faces: 2 },
          { id: "mb-mb-03-c-section", code: "MB 03", short: "CS", title: "C-Section", faces: 1 }
        ]
      },
      {
        id: "mb-postpartum-issues",
        title: "Post-partum Issues",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-mb-postpartum-issues.png`,
        cards: [
          { id: "mb-mb-04-postpartum-issues", code: "MB 04", short: "PP", title: "Post-partum Issues", faces: 2 },
          { id: "mb-mb-05-premature-birth", code: "MB 05", short: "PreT", title: "Premature Birth", faces: 1 },
          { id: "mb-mb-06-hyperbilirubinemia", code: "MB 06", short: "HypB", title: "Hyperbilirubinemia", faces: 1 },
          { id: "mb-mb-07-hydrocephalus", code: "MB 07", short: "Hydro", title: "Hydrocephalus", faces: 1 }
        ]
      },
      {
        id: "mb-congenital-heart-issues",
        title: "Congenital Heart Issues",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-mb-congenital-heart-issues.png`,
        cards: [
          { id: "mb-mb-08-congenital-heart-issues", code: "MB 08", short: "CHD", title: "Congenital Heart Issues", faces: 5 }
        ]
      }
    ]
  },
  {
    id: "PD",
    index: "14",
    title: "Pediatrics",
    unit: "Growth / Child Health",
    image: `${import.meta.env.BASE_URL}assets/patient-units/pu-unit-pd-pediatrics.png`,
    topics: [
      {
        id: "pd-neonate",
        title: "Neonate",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-pd-neonate.png`,
        cards: [
          { id: "pd-pd-00-neonate", code: "PD 00", short: "NEO", title: "Neonate", faces: 3 }
        ]
      },
      {
        id: "pd-age-development",
        title: "Age Development",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-pd-age-development.png`,
        cards: [
          { id: "pd-pd-01-age-development", code: "PD 01", short: "Dev", title: "Age Development", faces: 4 },
          { id: "pd-pd-02-immunization", code: "PD 02", short: "IMZ", title: "Immunization", faces: 3 }
        ]
      },
      {
        id: "pd-body-systems-1",
        title: "Body Systems 1",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-pd-body-systems-1.png`,
        cards: [
          { id: "pd-pd-03-respiratory-issues", code: "PD 03", short: "Respi", title: "Respiratory Issues", faces: 3 },
          { id: "pd-pd-04-cardiovascular-issues", code: "PD 04", short: "Cardio", title: "Cardiovascular Issues", faces: 4 }
        ]
      },
      {
        id: "pd-body-systems-2",
        title: "Body Systems 2",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-pd-body-systems-2.png`,
        cards: [
          { id: "pd-pd-05-gi-issues", code: "PD 05", short: "GI", title: "GI Issues", faces: 2 },
          { id: "pd-pd-06-endocrine-issues", code: "PD 06", short: "Endo", title: "Endocrine Issues", faces: 3 }
        ]
      },
      {
        id: "pd-neuro-issues",
        title: "Neuro Issues",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-pd-neuro-issues.png`,
        cards: [
          { id: "pd-pd-07-neurological-issues", code: "PD 07", short: "Neuro", title: "Neurological Issues", faces: 3 }
        ]
      },
      {
        id: "pd-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-pd-other-topics.png`,
        cards: [
          { id: "pd-etc-pediatric-issues", code: "ETC", short: "ETC", title: "Pediatric Issues", faces: 3 }
        ]
      }
    ]
  },
  {
    id: "MS",
    index: "15",
    title: "Med Surg",
    unit: "Ward / Fundamentals",
    image: `${import.meta.env.BASE_URL}assets/patient-units/pu-unit-ms-med-surg.png`,
    topics: [
      {
        id: "ms-physical-assessment",
        title: "Physical Assessment",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ms-physical-assessment.png`,
        cards: [
          { id: "ms-ms-01-assessment", code: "MS 01", short: "ASM", title: "Assessment", faces: 8 }
        ]
      },
      {
        id: "ms-gait-and-traction",
        title: "Gait and Traction",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ms-gait-and-traction.png`,
        cards: [
          { id: "ms-ms-02-gait-and-crutches", code: "MS 02", short: "ASW", title: "Gait and Crutches", faces: 3 },
          { id: "ms-ms-03-traction", code: "MS 03", short: "Trac", title: "Traction", faces: 2 }
        ]
      },
      {
        id: "ms-wounds-and-restraints",
        title: "Wounds and Restraints",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ms-wounds-and-restraints.png`,
        cards: [
          { id: "ms-ms-04-pressure-sores", code: "MS 04", short: "Ulcer", title: "Pressure Sores", faces: 2 },
          { id: "ms-ms-05-wound-care", code: "MS 05", short: "WC", title: "Wound Care", faces: 5 },
          { id: "ms-ms-06-restraints", code: "MS 06", short: "Res", title: "Restraints", faces: 2 }
        ]
      },
      {
        id: "ms-food",
        title: "Food",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ms-food.png`,
        cards: [
          { id: "ms-ms-07-nutrition", code: "MS 07", short: "Food", title: "Nutrition", faces: 10 },
          { id: "ms-ms-08-herbal-supplements", code: "MS 08", short: "Herb", title: "Herbal Supplements", faces: 4 }
        ]
      },
      {
        id: "ms-iv-therapy",
        title: "IV Therapy",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ms-iv-therapy.png`,
        cards: [
          { id: "ms-ms-09-iv-therapy", code: "MS 09", short: "IV", title: "IV Therapy", faces: 3 }
        ]
      },
      {
        id: "ms-clinical-signs",
        title: "Clinical Signs",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ms-clinical-signs.png`,
        cards: [
          { id: "ms-ms-10-clinical-signs", code: "MS 10", short: "Abrv", title: "Clinical Signs", faces: 2 }
        ]
      },
      {
        id: "ms-medications",
        title: "Medications",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ms-medications.png`,
        cards: [
          { id: "ms-ms-11-food-drug-interactions", code: "MS 11", short: "FDI", title: "Food-Drug Interactions", faces: 2 },
          { id: "ms-ms-12-medication-administration", code: "MS 12", short: "Rx", title: "Medication Administration", faces: 5 }
        ]
      },
      {
        id: "ms-diagnostics",
        title: "Diagnostics",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ms-diagnostics.png`,
        cards: [
          { id: "ms-ms-13-common-diagnostics", code: "MS 13", short: "Dx", title: "Common Diagnostics", faces: 18 }
        ]
      }
    ]
  },
  {
    id: "CC",
    index: "16",
    title: "Critical Care",
    unit: "ICU / Perioperative",
    image: `${import.meta.env.BASE_URL}assets/patient-units/pu-unit-cc-critical-care.png`,
    topics: [
      {
        id: "cc-hemodynamics",
        title: "Hemodynamics",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-cc-hemodynamics.png`,
        cards: [
          { id: "cc-cc-01-hemodynamics", code: "CC 01", short: "HDM", title: "Hemodynamics", faces: 3 }
        ]
      },
      {
        id: "cc-tubes-and-drains",
        title: "Tubes and Drains",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-cc-tubes-and-drains.png`,
        cards: [
          { id: "cc-cc-02-tubes-and-drains", code: "CC 02", short: "TDr", title: "Tubes and Drains", faces: 7 }
        ]
      },
      {
        id: "cc-oxygen",
        title: "Oxygen",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-cc-oxygen.png`,
        cards: [
          { id: "cc-cc-03-oxygen-and-ventilators", code: "CC 03", short: "Vent", title: "Oxygen and Ventilators", faces: 2 }
        ]
      },
      {
        id: "cc-periop-care",
        title: "Periop Care",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-cc-periop-care.png`,
        cards: [
          { id: "cc-cc-04-perioperative-care", code: "CC 04", short: "Ops", title: "Perioperative Care", faces: 13 }
        ]
      },
      {
        id: "cc-blood-products",
        title: "Blood Products",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-cc-blood-products.png`,
        cards: [
          { id: "cc-cc-05-blood-products", code: "CC 05", short: "Blood", title: "Blood Products", faces: 3 }
        ]
      }
    ]
  },
  {
    id: "ER",
    index: "17",
    title: "Emergency Department",
    unit: "Triage / Resuscitation",
    image: `${import.meta.env.BASE_URL}assets/patient-units/pu-unit-er-emergency.png`,
    topics: [
      {
        id: "er-cardiac-arrest",
        title: "Cardiac Arrest",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-er-cardiac-arrest.png`,
        cards: [
          { id: "er-er-01-cardiac-arrest", code: "ER 01", short: "CArr", title: "Cardiac Arrest", faces: 3 }
        ]
      },
      {
        id: "er-shock-and-syncope",
        title: "Shock and Syncope",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-er-shock-and-syncope.png`,
        cards: [
          { id: "er-er-02-shock", code: "ER 02", short: "SHK", title: "Shock", faces: 2 },
          { id: "er-er-03-syncope", code: "ER 03", short: "Sync", title: "Syncope", faces: 1 }
        ]
      },
      {
        id: "er-skin-emergencies",
        title: "Skin Emergencies",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-er-skin-emergencies.png`,
        cards: [
          { id: "er-er-04-burns", code: "ER 04", short: "Burn", title: "Burns", faces: 2 },
          { id: "er-er-05-bites-and-stings", code: "ER 05", short: "Bite", title: "Bites and Stings", faces: 2 },
          { id: "er-er-06-frostbite", code: "ER 06", short: "Frost", title: "Frostbite", faces: 1 }
        ]
      },
      {
        id: "er-nervous-system-issues",
        title: "Nervous System Issues",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-er-nervous-system-issues.png`,
        cards: [
          { id: "er-er-07-brain-injuries", code: "ER 07", short: "Brain", title: "Brain Injuries", faces: 2 },
          { id: "er-er-08-spinal-cord-injury", code: "ER 08", short: "Spine", title: "Spinal Cord Injury", faces: 1 }
        ]
      },
      {
        id: "er-bone-issue",
        title: "Bone Issue",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-er-bone-issue.png`,
        cards: [
          { id: "er-er-09-fractures", code: "ER 09", short: "Frac", title: "Fractures", faces: 2 }
        ]
      },
      {
        id: "er-endocrine-emergencies",
        title: "Endocrine Emergencies",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-er-endocrine-emergencies.png`,
        cards: [
          { id: "er-er-10-diabetic-emergencies", code: "ER 10", short: "DM-E", title: "Diabetic Emergencies", faces: 2 },
          { id: "er-er-11-endocrine-emergencies", code: "ER 11", short: "Endo", title: "Endocrine Emergencies", faces: 1 }
        ]
      },
      {
        id: "er-other-emergencies",
        title: "Other Emergencies",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-er-other-emergencies.png`,
        cards: [
          { id: "er-er-12-respiratory-emergencies", code: "ER 12", short: "Resp", title: "Respiratory Emergencies", faces: 2 },
          { id: "er-er-13-poisoning", code: "ER 13", short: "PSN", title: "Poisoning", faces: 1 },
          { id: "er-er-14-ob-emergencies", code: "ER 14", short: "OB-E", title: "OB Emergencies", faces: 2 }
        ]
      }
    ]
  },
  {
    id: "MH",
    index: "18",
    title: "Mental Health",
    unit: "Psych Ward",
    image: `${import.meta.env.BASE_URL}assets/patient-units/pu-unit-mh-mental-health.png`,
    topics: [
      {
        id: "mh-communication",
        title: "Communication",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-mh-communication.png`,
        cards: [
          { id: "mh-mh-01-therapeutic-communication", code: "MH 01", short: "TC", title: "Therapeutic Communication", faces: 4 }
        ]
      },
      {
        id: "mh-anxiety-and-mood",
        title: "Anxiety and Mood",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-mh-anxiety-and-mood.png`,
        cards: [
          { id: "mh-mh-02-anxiety-disorders", code: "MH 02", short: "AD", title: "Anxiety Disorders", faces: 2 },
          { id: "mh-mh-03-mood-disorders", code: "MH 03", short: "MD", title: "Mood Disorders", faces: 2 }
        ]
      },
      {
        id: "mh-psych-and-personality",
        title: "Psych and Personality",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-mh-psych-and-personality.png`,
        cards: [
          { id: "mh-mh-04-psychotic-disorders", code: "MH 04", short: "Psy", title: "Psychotic Disorders", faces: 3 },
          { id: "mh-mh-05-personality-disorders", code: "MH 05", short: "Pers", title: "Personality Disorders", faces: 2 }
        ]
      },
      {
        id: "mh-add-and-asd",
        title: "ADD and ASD",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-mh-add-and-asd.png`,
        cards: [
          { id: "mh-mh-06-attention-deficit-disorder", code: "MH 06", short: "ADHD", title: "Attention-deficit Disorder", faces: 1 },
          { id: "mh-mh-07-autism-spectrum", code: "MH 07", short: "ASD", title: "Autism Spectrum", faces: 2 }
        ]
      },
      {
        id: "mh-substance-abuse",
        title: "Substance Abuse",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-mh-substance-abuse.png`,
        cards: [
          { id: "mh-mh-08-substance-abuse", code: "MH 08", short: "Subst", title: "Substance Abuse", faces: 2 }
        ]
      },
      {
        id: "mh-psych-meds",
        title: "Psych Meds",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-mh-psych-meds.png`,
        cards: [
          { id: "mh-etc-medications", code: "ETC", short: "ETC", title: "Medications", faces: 4 }
        ]
      }
    ]
  },
  {
    id: "NS",
    index: "19",
    title: "Nurse Station",
    unit: "Leadership / Priorities",
    image: `${import.meta.env.BASE_URL}assets/patient-units/pu-unit-ns-nurse-station.png`,
    topics: [
      {
        id: "ns-nurse-ethics",
        title: "Nurse Ethics",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ns-nurse-ethics.png`,
        cards: [
          { id: "ns-ns-01-nursing-ethics", code: "NS 01", short: "NE", title: "Nursing Ethics", faces: 4 }
        ]
      },
      {
        id: "ns-delegation",
        title: "Delegation",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ns-delegation.png`,
        cards: [
          { id: "ns-ns-02-nursing-delegation", code: "NS 02", short: "Deleg", title: "Nursing Delegation", faces: 2 }
        ]
      },
      {
        id: "ns-prioritization",
        title: "Prioritization",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ns-prioritization.png`,
        cards: [
          { id: "ns-ns-03-prioritization", code: "NS 03", short: "Pri", title: "Prioritization", faces: 2 }
        ]
      },
      {
        id: "ns-culture-and-leadership",
        title: "Culture and Leadership",
        visual: `${import.meta.env.BASE_URL}assets/patient-topic-visuals-wide/pu-ns-culture-and-leadership.png`,
        cards: [
          { id: "ns-ns-04-culture", code: "NS 04", short: "Cltr", title: "Culture", faces: 3 },
          { id: "ns-ns-05-leadership", code: "NS 05", short: "Lead", title: "Leadership", faces: 2 }
        ]
      }
    ]
  }
];

export const getPatientUnitById = (id) => patientUnits.find((unit) => unit.id === id);
