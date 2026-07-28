export const bodySystems = [
  {
    id: "CV",
    index: "01",
    title: "Cardiovascular",
    image: `${import.meta.env.BASE_URL}assets/systems/cv-cardiovascular.png`,
    topics: [
      {
        id: "cv-hypertension",
        title: "Hypertension",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/cv-hypertension.png`,
        cards: [
          { id: "cv-cv-01-hypertension", code: "CV 01", short: "HTN", title: "Hypertension", faces: 4 }
        ]
      },
      {
        id: "cv-cad",
        title: "CAD",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/cv-cad.png`,
        cards: [
          { id: "cv-cv-02-coronary-artery-disease", code: "CV 02", short: "CAD", title: "Coronary Artery Disease", faces: 3 }
        ]
      },
      {
        id: "cv-heart-related-issues",
        title: "Heart-related Issues",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/cv-heart-related-issues.png`,
        cards: [
          { id: "cv-cv-03-congestive-heart-failure", code: "CV 03", short: "CHF", title: "Congestive Heart Failure", faces: 2 },
          { id: "cv-cv-04-valvular-diseases", code: "CV 04", short: "Valve", title: "Valvular Diseases", faces: 3 },
          { id: "cv-cv-05-cardiomyopathy", code: "CV 05", short: "CMPY", title: "Cardiomyopathy", faces: 2 },
          { id: "cv-cv-06-pericardial-diseases", code: "CV 06", short: "Peri", title: "Pericardial Diseases", faces: 2 }
        ]
      },
      {
        id: "cv-peripheral-vascular",
        title: "Peripheral Vascular",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/cv-peripheral-vascular.png`,
        cards: [
          { id: "cv-cv-07-aortic-aneurysm", code: "CV 07", short: "AA", title: "Aortic Aneurysm", faces: 2 },
          { id: "cv-cv-08-peripheral-artery-disease", code: "CV 08", short: "PAD", title: "Peripheral Artery Disease", faces: 3 },
          { id: "cv-cv-09-peripheral-venous-disease", code: "CV 09", short: "PVD", title: "Peripheral Venous Disease", faces: 3 },
          { id: "cv-cv-10-cholesterol", code: "CV 10", short: "Chol", title: "Cholesterol", faces: 2 }
        ]
      },
      {
        id: "cv-ecg",
        title: "ECG",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/cv-ecg.png`,
        cards: [
          { id: "cv-cv-11-cardiac-arrythmias-ecg", code: "CV 11", short: "ECG", title: "Cardiac Arrythmias (ECG)", faces: 5 }
        ]
      },
      {
        id: "cv-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/cv-other-topics.png`,
        cards: [
          { id: "cv-etc-etc-cardiac", code: "ETC", short: "ETC", title: "ETC Cardiac", faces: 6 }
        ]
      }
    ]
  },
  {
    id: "RS",
    index: "02",
    title: "Respiratory",
    image: `${import.meta.env.BASE_URL}assets/systems/rs-respiratory.png`,
    topics: [
      {
        id: "rs-obstructive-diseases",
        title: "Obstructive Diseases",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/rs-obstructive-diseases.png`,
        cards: [
          { id: "rs-rs-01-asthma", code: "RS 01", short: "ASTH", title: "Asthma", faces: 3 },
          { id: "rs-rs-02-obstructive-pulmonary-disease", code: "RS 02", short: "COPD", title: "Obstructive Pulmonary Disease", faces: 3 }
        ]
      },
      {
        id: "rs-fluid-related",
        title: "Fluid-Related",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/rs-fluid-related.png`,
        cards: [
          { id: "rs-rs-03-acute-respiratory-distress", code: "RS 03", short: "ARDS", title: "Acute Respiratory Distress", faces: 2 },
          { id: "rs-rs-04-pleural-effusion", code: "RS 04", short: "PEff", title: "Pleural Effusion", faces: 3 }
        ]
      },
      {
        id: "rs-pulmo-embolism",
        title: "Pulmo-Embolism",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/rs-pulmo-embolism.png`,
        cards: [
          { id: "rs-rs-05-pulmonary-embolism", code: "RS 05", short: "PE", title: "Pulmonary Embolism", faces: 2 }
        ]
      },
      {
        id: "rs-acid-base",
        title: "Acid-Base",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/rs-acid-base.png`,
        cards: [
          { id: "rs-rs-06-acid-base-respiration", code: "RS 06", short: "A/B", title: "Acid-Base (Respiration)", faces: 5 }
        ]
      },
      {
        id: "rs-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/rs-other-topics.png`,
        cards: [
          { id: "rs-etc-etc-respiratory", code: "ETC", short: "ETC", title: "ETC Respiratory", faces: 3 }
        ]
      }
    ]
  },
  {
    id: "GI",
    index: "03",
    title: "Gastrointestinal",
    image: `${import.meta.env.BASE_URL}assets/systems/gi-gastrointestinal.png`,
    topics: [
      {
        id: "gi-upper-gi-issues",
        title: "Upper GI issues",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/gi-upper-gi-issues.png`,
        cards: [
          { id: "gi-gi-01-esophagitis", code: "GI 01", short: "Eso", title: "Esophagitis", faces: 2 },
          { id: "gi-gi-02-reflux-disease", code: "GI 02", short: "GERD", title: "Reflux Disease", faces: 2 },
          { id: "gi-gi-03-peptic-ulcer", code: "GI 03", short: "PUD", title: "Peptic Ulcer", faces: 3 }
        ]
      },
      {
        id: "gi-abdominal",
        title: "Abdominal",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/gi-abdominal.png`,
        cards: [
          { id: "gi-gi-04-gallbladder-issues", code: "GI 04", short: "Chole", title: "Gallbladder Issues", faces: 3 },
          { id: "gi-gi-05-pancreatitis", code: "GI 05", short: "PCTS", title: "Pancreatitis", faces: 2 }
        ]
      },
      {
        id: "gi-liver-issues",
        title: "Liver Issues",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/gi-liver-issues.png`,
        cards: [
          { id: "gi-gi-06-hepatitis", code: "GI 06", short: "Hepa", title: "Hepatitis", faces: 3 },
          { id: "gi-gi-07-cirrhosis", code: "GI 07", short: "Cirr", title: "Cirrhosis", faces: 4 }
        ]
      },
      {
        id: "gi-intestinal-issues",
        title: "Intestinal Issues",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/gi-intestinal-issues.png`,
        cards: [
          { id: "gi-gi-08-appendicitis", code: "GI 08", short: "App", title: "Appendicitis", faces: 2 },
          { id: "gi-gi-09-gi-bleeding", code: "GI 09", short: "GI Bleed", title: "GI Bleeding", faces: 2 },
          { id: "gi-gi-10-diverticular-diseases", code: "GI 10", short: "DVRT", title: "Diverticular Diseases", faces: 2 },
          { id: "gi-gi-11-irritable-bowel", code: "GI 11", short: "IBD", title: "Irritable Bowel", faces: 2 }
        ]
      },
      {
        id: "gi-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/gi-other-topics.png`,
        cards: [
          { id: "gi-gi-12-motility-issues", code: "GI 12", short: "Mot", title: "Motility Issues", faces: 2 },
          { id: "gi-etc-etc-gastro", code: "ETC", short: "ETC", title: "ETC Gastro", faces: 5 }
        ]
      }
    ]
  },
  {
    id: "NPH",
    index: "04",
    title: "Nephrology",
    image: `${import.meta.env.BASE_URL}assets/systems/nph-nephrology.png`,
    topics: [
      {
        id: "nph-kidney-diseases",
        title: "Kidney Diseases",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/nph-kidney-diseases.png`,
        cards: [
          { id: "nph-nph-01-chronic-kidney-disease", code: "NPH 01", short: "CKD", title: "Chronic Kidney Disease", faces: 3 },
          { id: "nph-nph-02-acute-kidney-disease", code: "NPH 02", short: "AKD", title: "Acute Kidney Disease", faces: 3 }
        ]
      },
      {
        id: "nph-stones-and-cysts",
        title: "Stones and Cysts",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/nph-stones-and-cysts.png`,
        cards: [
          { id: "nph-nph-03-kidney-stones", code: "NPH 03", short: "STN", title: "Kidney Stones", faces: 2 },
          { id: "nph-nph-04-cysts-and-cancer", code: "NPH 04", short: "C/Ca", title: "Cysts and Cancer", faces: 2 }
        ]
      },
      {
        id: "nph-adjuncts",
        title: "Adjuncts",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/nph-adjuncts.png`,
        cards: [
          { id: "nph-nph-05-benign-prostatic-hyperplasia", code: "NPH 05", short: "BPH", title: "Benign Prostatic Hyperplasia", faces: 3 },
          { id: "nph-nph-06-cryptorchidism", code: "NPH 06", short: "Cryp", title: "Cryptorchidism", faces: 2 }
        ]
      },
      {
        id: "nph-acid-base",
        title: "Acid-Base",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/nph-acid-base.png`,
        cards: [
          { id: "nph-nph-07-acid-base-issues", code: "NPH 07", short: "A/B", title: "Acid-Base Issues", faces: 5 }
        ]
      },
      {
        id: "nph-ions-electrolytes",
        title: "Ions (Electrolytes)",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/nph-ions-electrolytes.png`,
        cards: [
          { id: "nph-nph-08-electrolyte-issues", code: "NPH 08", short: "Ions", title: "Electrolyte Issues", faces: 7 }
        ]
      },
      {
        id: "nph-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/nph-other-topics.png`,
        cards: [
          { id: "nph-etc-etc-renal-urinary", code: "ETC", short: "ETC", title: "ETC Renal/Urinary", faces: 7 }
        ]
      }
    ]
  },
  {
    id: "HM",
    index: "05",
    title: "Hematology",
    image: `${import.meta.env.BASE_URL}assets/systems/hm-hematology.png`,
    topics: [
      {
        id: "hm-anemia",
        title: "Anemia",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/hm-anemia.png`,
        cards: [
          { id: "hm-hm-01-anemia", code: "HM 01", short: "Anm", title: "Anemia", faces: 6 }
        ]
      },
      {
        id: "hm-bleeding",
        title: "Bleeding",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/hm-bleeding.png`,
        cards: [
          { id: "hm-hm-02-bleeding", code: "HM 02", short: "Bld", title: "Bleeding", faces: 3 },
          { id: "hm-hm-03-thrombocytopenia", code: "HM 03", short: "TCP", title: "Thrombocytopenia", faces: 3 }
        ]
      },
      {
        id: "hm-blood-disorders",
        title: "Blood disorders",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/hm-blood-disorders.png`,
        cards: [
          { id: "hm-hm-04-thrombophilia", code: "HM 04", short: "TP", title: "Thrombophilia", faces: 2 },
          { id: "hm-hm-05-leukemia", code: "HM 05", short: "Leu", title: "Leukemia", faces: 3 },
          { id: "hm-hm-06-polycythemia", code: "HM 06", short: "PCV", title: "Polycythemia", faces: 2 },
          { id: "hm-hm-07-lymphoma", code: "HM 07", short: "Lym", title: "Lymphoma", faces: 2 }
        ]
      },
      {
        id: "hm-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/hm-other-topics.png`,
        cards: [
          { id: "hm-etc-etc-hematology", code: "ETC", short: "ETC", title: "ETC Hematology", faces: 2 }
        ]
      }
    ]
  },
  {
    id: "IF",
    index: "06",
    title: "Infectious Diseases",
    image: `${import.meta.env.BASE_URL}assets/systems/if-infectious.png`,
    topics: [
      {
        id: "if-overview",
        title: "Overview",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/if-overview.png`,
        cards: [
          { id: "if-if-01-antibiotics-overview", code: "IF 01", short: "OV", title: "Antibiotics Overview", faces: 5 }
        ]
      },
      {
        id: "if-immunization",
        title: "Immunization",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/if-immunization.png`,
        cards: [
          { id: "if-if-02-immunizations", code: "IF 02", short: "IMZ", title: "Immunizations", faces: 3 }
        ]
      },
      {
        id: "if-head",
        title: "Head",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/if-head.png`,
        cards: [
          { id: "if-if-03-brain-infections", code: "IF 03", short: "BInfx", title: "Brain Infections", faces: 3 },
          { id: "if-if-04-ear-nose-throat", code: "IF 04", short: "ENT", title: "Ear Nose Throat", faces: 2 }
        ]
      },
      {
        id: "if-respiratory",
        title: "Respiratory",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/if-respiratory.png`,
        cards: [
          { id: "if-if-05-tuberculosis", code: "IF 05", short: "TB", title: "Tuberculosis", faces: 3 },
          { id: "if-if-06-pneumonia", code: "IF 06", short: "PNA", title: "Pneumonia", faces: 2 },
          { id: "if-if-07-sars-coronavirus", code: "IF 07", short: "SARS", title: "SARS Coronavirus", faces: 2 }
        ]
      },
      {
        id: "if-heart",
        title: "Heart",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/if-heart.png`,
        cards: [
          { id: "if-if-08-endocarditis", code: "IF 08", short: "Endo", title: "Endocarditis", faces: 3 }
        ]
      },
      {
        id: "if-other-infections",
        title: "Other Infections",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/if-other-infections.png`,
        cards: [
          { id: "if-if-09-hiv-aids", code: "IF 09", short: "HIV", title: "HIV/AIDS", faces: 3 },
          { id: "if-if-10-genital-infections", code: "IF 10", short: "STD", title: "Genital Infections", faces: 2 },
          { id: "if-if-11-urinary-infections", code: "IF 11", short: "UTI", title: "Urinary Infections", faces: 3 }
        ]
      }
    ]
  },
  {
    id: "NE",
    index: "07",
    title: "Neurology",
    image: `${import.meta.env.BASE_URL}assets/systems/ne-neurology.png`,
    topics: [
      {
        id: "ne-stroke",
        title: "Stroke",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/ne-stroke.png`,
        cards: [
          { id: "ne-ne-01-stroke", code: "NE 01", short: "CVA", title: "Stroke", faces: 3 }
        ]
      },
      {
        id: "ne-brain-issues",
        title: "Brain Issues",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/ne-brain-issues.png`,
        cards: [
          { id: "ne-ne-02-seizure", code: "NE 02", short: "SZ", title: "Seizure", faces: 3 },
          { id: "ne-ne-03-cerebral-palsy", code: "NE 03", short: "CP", title: "Cerebral Palsy", faces: 2 },
          { id: "ne-ne-04-alzheimer-s-and-dementia", code: "NE 04", short: "AZD", title: "Alzheimer’s and Dementia", faces: 2 },
          { id: "ne-ne-05-als-lou-gehrig-s", code: "NE 05", short: "ALS", title: "ALS/Lou Gehrig’s", faces: 2 },
          { id: "ne-ne-06-parkinson-s-disease", code: "NE 06", short: "PRD", title: "Parkinson’s Disease", faces: 2 }
        ]
      },
      {
        id: "ne-cns-and-pns-issues",
        title: "CNS and PNS issues",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/ne-cns-and-pns-issues.png`,
        cards: [
          { id: "ne-ne-07-demyelination", code: "NE 07", short: "DMY", title: "Demyelination", faces: 2 },
          { id: "ne-ne-08-myasthenia-gravis", code: "NE 08", short: "MG", title: "Myasthenia Gravis", faces: 3 }
        ]
      },
      {
        id: "ne-ent-issues",
        title: "ENT issues",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/ne-ent-issues.png`,
        cards: [
          { id: "ne-ne-09-eye-ear-nose-throat", code: "NE 09", short: "EENT", title: "Eye Ear Nose Throat", faces: 8 }
        ]
      },
      {
        id: "ne-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/ne-other-topics.png`,
        cards: [
          { id: "ne-etc-etc-neurological", code: "ETC", short: "ETC", title: "ETC Neurological", faces: 2 }
        ]
      }
    ]
  },
  {
    id: "EN",
    index: "08",
    title: "Endocrinology",
    image: `${import.meta.env.BASE_URL}assets/systems/en-endocrinology.png`,
    topics: [
      {
        id: "en-pituitary-issues",
        title: "Pituitary Issues",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/en-pituitary-issues.png`,
        cards: [
          { id: "en-en-01-anterior-pituitary", code: "EN 01", short: "ANT", title: "Anterior Pituitary", faces: 3 },
          { id: "en-en-02-posterior-pituitary", code: "EN 02", short: "POST", title: "Posterior Pituitary", faces: 3 }
        ]
      },
      {
        id: "en-thyroid-issues",
        title: "Thyroid Issues",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/en-thyroid-issues.png`,
        cards: [
          { id: "en-en-03-thyroid", code: "EN 03", short: "THY", title: "Thyroid", faces: 4 }
        ]
      },
      {
        id: "en-adrenal-issues",
        title: "Adrenal Issues",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/en-adrenal-issues.png`,
        cards: [
          { id: "en-en-04-adrenals", code: "EN 04", short: "ADR", title: "Adrenals", faces: 4 }
        ]
      },
      {
        id: "en-diabetes-mellitus",
        title: "Diabetes Mellitus",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/en-diabetes-mellitus.png`,
        cards: [
          { id: "en-en-05-diabetes-mellitus", code: "EN 05", short: "DM", title: "Diabetes Mellitus", faces: 6 }
        ]
      },
      {
        id: "en-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/en-other-topics.png`,
        cards: [
          { id: "en-etc-etc-endocrine", code: "ETC", short: "ETC", title: "ETC Endocrine", faces: 2 }
        ]
      }
    ]
  },
  {
    id: "MK",
    index: "09",
    title: "Musculoskeletal",
    image: `${import.meta.env.BASE_URL}assets/systems/mk-musculoskeletal.png`,
    topics: [
      {
        id: "mk-arthritis-and-sle",
        title: "Arthritis and SLE",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/mk-arthritis-and-sle.png`,
        cards: [
          { id: "mk-mk-01-arthritis", code: "MK 01", short: "Arth", title: "Arthritis", faces: 3 },
          { id: "mk-mk-02-lupus", code: "MK 02", short: "SLE", title: "Lupus", faces: 2 }
        ]
      },
      {
        id: "mk-bone-issues",
        title: "Bone issues",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/mk-bone-issues.png`,
        cards: [
          { id: "mk-mk-03-osteoporosis", code: "MK 03", short: "OPS", title: "Osteoporosis", faces: 2 },
          { id: "mk-mk-04-fractures", code: "MK 04", short: "Frac", title: "Fractures", faces: 3 },
          { id: "mk-mk-05-osteomyelitis", code: "MK 05", short: "OSM", title: "Osteomyelitis", faces: 1 }
        ]
      },
      {
        id: "mk-spine-and-muscle",
        title: "Spine and Muscle",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/mk-spine-and-muscle.png`,
        cards: [
          { id: "mk-mk-06-disc-herniation", code: "MK 06", short: "DscH", title: "Disc Herniation", faces: 1 },
          { id: "mk-mk07-rhabdomyolysis", code: "MK07", short: "Rhab", title: "Rhabdomyolysis", faces: 1 }
        ]
      },
      {
        id: "mk-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/mk-other-topics.png`,
        cards: [
          { id: "mk-etc-etc-musculoskeletal", code: "ETC", short: "ETC", title: "ETC Musculoskeletal", faces: 3 }
        ]
      }
    ]
  },
  {
    id: "SK",
    index: "10",
    title: "Skin",
    image: `${import.meta.env.BASE_URL}assets/systems/sk-skin.png`,
    topics: [
      {
        id: "sk-dermatitis-and-psoriasis",
        title: "Dermatitis and Psoriasis",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/sk-dermatitis-and-psoriasis.png`,
        cards: [
          { id: "sk-sk-01-dermatitis", code: "SK 01", short: "Drts", title: "Dermatitis", faces: 3 },
          { id: "sk-sk-02-psoriasis", code: "SK 02", short: "Psr", title: "Psoriasis", faces: 2 }
        ]
      },
      {
        id: "sk-urticaria-and-acne",
        title: "Urticaria and Acne",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/sk-urticaria-and-acne.png`,
        cards: [
          { id: "sk-sk-03-urticaria", code: "SK 03", short: "Urt", title: "Urticaria", faces: 1 },
          { id: "sk-sk-04-acne", code: "SK 04", short: "Acne", title: "Acne", faces: 2 }
        ]
      },
      {
        id: "sk-skin-infections",
        title: "Skin Infections",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/sk-skin-infections.png`,
        cards: [
          { id: "sk-sk-05-skin-infections", code: "SK 05", short: "Infxn", title: "Skin Infections", faces: 5 }
        ]
      },
      {
        id: "sk-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/sk-other-topics.png`,
        cards: [
          { id: "sk-etc-etc-integumentary", code: "ETC", short: "ETC", title: "ETC Integumentary", faces: 3 }
        ]
      }
    ]
  },
  {
    id: "CA",
    index: "11",
    title: "Oncology",
    image: `${import.meta.env.BASE_URL}assets/systems/ca-oncology.png`,
    topics: [
      {
        id: "ca-terminologies",
        title: "Terminologies",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/ca-terminologies.png`,
        cards: [
          { id: "ca-ca-00-types-of-cancers-terminologies", code: "CA 00", short: "Term", title: "Types of Cancers (Terminologies)", faces: null }
        ]
      },
      {
        id: "ca-brain-and-bone",
        title: "Brain and Bone",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/ca-brain-and-bone.png`,
        cards: [
          { id: "ca-ca-01-brain-tumors", code: "CA 01", short: "BTm", title: "Brain Tumors", faces: 2 },
          { id: "ca-ca-02-bone-tumors", code: "CA 02", short: "Bone", title: "Bone Tumors", faces: 4 }
        ]
      },
      {
        id: "ca-gi-cancers",
        title: "GI Cancers",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/ca-gi-cancers.png`,
        cards: [
          { id: "ca-ca-03-colon-cancer", code: "CA 03", short: "Colon", title: "Colon Cancer", faces: 2 },
          { id: "ca-ca-04-hepatic-cancer", code: "CA 04", short: "HCC", title: "Hepatic Cancer", faces: 3 },
          { id: "ca-ca-05-pancreatic-cancer", code: "CA 05", short: "PC", title: "Pancreatic Cancer", faces: 2 }
        ]
      },
      {
        id: "ca-other-cancers",
        title: "Other Cancers",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/ca-other-cancers.png`,
        cards: [
          { id: "ca-ca-06-prostate-cancer", code: "CA 06", short: "PTC", title: "Prostate Cancer", faces: 2 },
          { id: "ca-ca-07-lung-cancer", code: "CA 07", short: "LC", title: "Lung Cancer", faces: 3 },
          { id: "ca-ca-08-skin-cancer", code: "CA 08", short: "SC", title: "Skin Cancer", faces: 3 }
        ]
      },
      {
        id: "ca-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/ca-other-topics.png`,
        cards: [
          { id: "ca-etc-etc-oncology", code: "ETC", short: "ETC", title: "ETC Oncology", faces: 5 }
        ]
      }
    ]
  },
  {
    id: "GN",
    index: "12",
    title: "Gynecology",
    image: `${import.meta.env.BASE_URL}assets/systems/gn-gynecology.png`,
    topics: [
      {
        id: "gn-gyn-cancers",
        title: "GYN Cancers",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/gn-gyn-cancers.png`,
        cards: [
          { id: "gn-gn-01-breast-cancer", code: "GN 01", short: "BrCA", title: "Breast Cancer", faces: 3 },
          { id: "gn-gn-02-ovarian-cancer", code: "GN 02", short: "Ova", title: "Ovarian Cancer", faces: 2 },
          { id: "gn-gn-03-cervical-cancer", code: "GN 03", short: "Cerv", title: "Cervical Cancer", faces: 3 }
        ]
      },
      {
        id: "gn-menopause-and-contraceptives",
        title: "Menopause and Contraceptives",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/gn-menopause-and-contraceptives.png`,
        cards: [
          { id: "gn-gn-04-menopause", code: "GN 04", short: "MNP", title: "Menopause", faces: 1 },
          { id: "gn-gn-05-contraceptives", code: "GN 05", short: "CTR", title: "Contraceptives", faces: 6 }
        ]
      },
      {
        id: "gn-other-topics",
        title: "Other Topics",
        visual: `${import.meta.env.BASE_URL}assets/topic-visuals-wide/gn-other-topics.png`,
        cards: [
          { id: "gn-etc-etc-gynecology", code: "ETC", short: "ETC", title: "ETC Gynecology", faces: 3 }
        ]
      }
    ]
  }
];

export const getSystemById = (id) => bodySystems.find((system) => system.id === id);

export const getTopicById = (systemId, topicId) => getSystemById(systemId)?.topics.find((topic) => topic.id === topicId);
