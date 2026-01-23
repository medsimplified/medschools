"use client";

import { useCallback, useMemo, useState, type CSSProperties } from "react";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import { useSubscriptionPlans, type SubscriptionPlan } from "@/hooks/useSubscriptionPlans";

const EMPTY_FORM = {
  id: "",
  title: "",
  slug: "",
  description: "",
  price: "",
  currency: "INR",
  durationDays: "",
  durationLabel: "",
  displayOrder: "0",
  highlight: "",
  featuresText: "",
  isPopular: false,
  isPublished: false,
};

type PlanFormState = typeof EMPTY_FORM;

type SubmitMode = "create" | "update";

const TOP_WRAP_STYLE: CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "48px",
  marginTop: "48px",
};

const TOP_BACKGROUND_STYLE: CSSProperties = {
  backgroundImage: "url(/assets/img/bg/instructor_dashboard_bg.png)",
  backgroundPosition: "center top",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  width: "100%",
  maxWidth: "1400px",
  height: "260px",
  borderRadius: "18px",
  boxShadow: "0 4px 24px rgba(13,68,122,0.08)",
  marginTop: "80px",
};

function formatCurrency(value: number, currency: string) {
  const formatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const symbol = currency === "INR" ? "₹" : currency;
  return `${symbol}${formatter.format(value)}`;
}

function parseFeatures(featuresText: string) {
  return featuresText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export default function PricingPlansManager() {
  const { plans, loading, error, refetch } = useSubscriptionPlans({ scope: "all" });
  const [formState, setFormState] = useState<PlanFormState>(EMPTY_FORM);
  const [submitMode, setSubmitMode] = useState<SubmitMode>("create");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFormState(EMPTY_FORM);
    setSubmitMode("create");
    setFormError(null);
    setSuccessMessage(null);
  }, []);

  const onEditPlan = useCallback((plan: SubscriptionPlan) => {
    setFormState({
      id: plan.id,
      title: plan.title,
      slug: plan.slug,
      description: plan.description || "",
      price: String(plan.price),
      currency: plan.currency,
      durationDays: String(plan.durationDays),
      durationLabel: plan.durationLabel,
      displayOrder: String(plan.displayOrder ?? 0),
      highlight: plan.highlight || "",
      featuresText: plan.features.join("\n"),
      isPopular: plan.isPopular,
      isPublished: plan.isPublished,
    });
    setSubmitMode("update");
    setFormError(null);
    setSuccessMessage(null);
  }, []);

  const updateField = <Key extends keyof PlanFormState>(key: Key, value: PlanFormState[Key]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitting(true);
      setFormError(null);
      setSuccessMessage(null);

      const payload: Record<string, unknown> = {
        title: formState.title.trim(),
        slug: formState.slug.trim(),
        description: formState.description.trim() || null,
        price: Number(formState.price),
        currency: formState.currency.trim() || "INR",
        durationDays: Number(formState.durationDays),
        durationLabel: formState.durationLabel.trim(),
        displayOrder: Number(formState.displayOrder || 0),
        highlight: formState.highlight.trim() || null,
        features: parseFeatures(formState.featuresText),
        isPopular: formState.isPopular,
        isPublished: formState.isPublished,
      };

      if (!payload.title) {
        setFormError("Title is required");
        setSubmitting(false);
        return;
      }

      if (!payload.durationLabel) {
        setFormError("Duration label is required");
        setSubmitting(false);
        return;
      }

      if (!Number.isFinite(payload.price as number) || (payload.price as number) < 0) {
        setFormError("Price must be a positive number");
        setSubmitting(false);
        return;
      }

      if (!Number.isFinite(payload.durationDays as number) || (payload.durationDays as number) <= 0) {
        setFormError("Duration days must be greater than 0");
        setSubmitting(false);
        return;
      }

      if (submitMode === "update") {
        payload.id = formState.id;
      }

      try {
        const response = await fetch("/api/subscription-plans", {
          method: submitMode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Failed to save plan");
        }

        await refetch();
        setSuccessMessage(submitMode === "create" ? "Plan created successfully" : "Plan updated successfully");
        if (submitMode === "create") {
          resetForm();
        }
      } catch (err) {
        console.error("Failed to save plan", err);
        setFormError(err instanceof Error ? err.message : "Failed to save plan");
      } finally {
        setSubmitting(false);
      }
    },
    [formState, submitMode, refetch, resetForm]
  );

  const handleTogglePublish = useCallback(
    async (plan: SubscriptionPlan) => {
      try {
        const response = await fetch("/api/subscription-plans", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: plan.id, isPublished: !plan.isPublished }),
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Failed to update plan status");
        }

        await refetch();
      } catch (err) {
        console.error("Failed to toggle publish", err);
        setFormError(err instanceof Error ? err.message : "Failed to update publish status");
      }
    },
    [refetch]
  );

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return a.title.localeCompare(b.title);
    });
  }, [plans]);

  return (
    <section className="dashboard__area section-pb-120">
      <div className="dashboard__top-wrap mt-120" style={TOP_WRAP_STYLE}>
        <div className="dashboard__top-bg" style={TOP_BACKGROUND_STYLE}></div>
      </div>
      <div className="dashboard__bg" />
      <div className="container">
        <div className="dashboard__inner-wrap row">
          <DashboardSidebar />
          <div className="col-lg-9">
            <div
              className="dashboard-content"
              style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 24px rgba(0,0,0,0.07)", padding: "32px 24px" }}
            >
              <div className="dashboard__content-title mb-4 pb-2 border-bottom">
                <h4 className="title mb-0" style={{ fontWeight: 700 }}>Subscription Plans</h4>
                <p className="text-muted mt-2 mb-0" style={{ fontSize: 15 }}>
                  Create, update, and publish subscription plans for the public site and student dashboard.
                </p>
              </div>

              <div className="dashboard__form-wrap mb-5">
                <form className="dashboard__form row g-3" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Title*</label>
                    <input
                      className="form-control"
                      value={formState.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      placeholder="Plan title"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Slug</label>
                    <input
                      className="form-control"
                      value={formState.slug}
                      onChange={(event) => updateField("slug", event.target.value)}
                      placeholder="leave blank to auto-generate"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Price (₹)*</label>
                    <input
                      className="form-control"
                      type="number"
                      min={0}
                      step={1}
                      value={formState.price}
                      onChange={(event) => updateField("price", event.target.value)}
                      placeholder="2499"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Currency</label>
                    <input
                      className="form-control"
                      value={formState.currency}
                      onChange={(event) => updateField("currency", event.target.value)}
                      placeholder="INR"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Duration Days*</label>
                    <input
                      className="form-control"
                      type="number"
                      min={1}
                      step={1}
                      value={formState.durationDays}
                      onChange={(event) => updateField("durationDays", event.target.value)}
                      placeholder="30"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Duration Label*</label>
                    <input
                      className="form-control"
                      value={formState.durationLabel}
                      onChange={(event) => updateField("durationLabel", event.target.value)}
                      placeholder="/month, /3 months, /year"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Display Order</label>
                    <input
                      className="form-control"
                      type="number"
                      step={1}
                      value={formState.displayOrder}
                      onChange={(event) => updateField("displayOrder", event.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Highlight Badge</label>
                    <input
                      className="form-control"
                      value={formState.highlight}
                      onChange={(event) => updateField("highlight", event.target.value)}
                      placeholder="Most Popular"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={formState.description}
                      onChange={(event) => updateField("description", event.target.value)}
                      placeholder="Short description (optional)"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Features (one per line)</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={formState.featuresText}
                      onChange={(event) => updateField("featuresText", event.target.value)}
                      placeholder={"Access to all video lectures\nDownload PDF materials"}
                    />
                  </div>
                  <div className="col-md-3 d-flex align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="plan-popular"
                        checked={formState.isPopular}
                        onChange={(event) => updateField("isPopular", event.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="plan-popular">
                        Mark as popular
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 d-flex align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="plan-published"
                        checked={formState.isPublished}
                        onChange={(event) => updateField("isPublished", event.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="plan-published">
                        Published
                      </label>
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    {formError && (
                      <div className="alert alert-danger" role="alert">
                        {formError}
                      </div>
                    )}
                    {successMessage && (
                      <div className="alert alert-success" role="alert">
                        {successMessage}
                      </div>
                    )}
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? "Saving..." : submitMode === "create" ? "Create Plan" : "Update Plan"}
                    </button>
                    {submitMode === "update" && (
                      <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={resetForm}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="dashboard__table-wrap">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0" style={{ fontWeight: 700 }}>Existing Plans</h5>
                  {loading && <span className="text-muted" style={{ fontSize: 13 }}>Loading plans...</span>}
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ minWidth: 180 }}>Title</th>
                        <th style={{ minWidth: 120 }}>Price</th>
                        <th style={{ minWidth: 140 }}>Duration</th>
                        <th style={{ minWidth: 120 }}>Status</th>
                        <th style={{ minWidth: 120 }}>Popular</th>
                        <th style={{ minWidth: 140 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPlans.map((plan) => (
                        <tr key={plan.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{plan.title}</div>
                            <div className="text-muted" style={{ fontSize: 13 }}>{plan.slug}</div>
                          </td>
                          <td>{formatCurrency(plan.price, plan.currency)}</td>
                          <td>
                            <div>{plan.durationLabel}</div>
                            <small className="text-muted">{plan.durationDays} days</small>
                          </td>
                          <td>
                            <span className={`badge ${plan.isPublished ? "bg-success" : "bg-secondary"}`}>
                              {plan.isPublished ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${plan.isPopular ? "bg-primary" : "bg-light text-dark"}`}>
                              {plan.isPopular ? "Popular" : "Standard"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => onEditPlan(plan)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className={`btn btn-sm ${plan.isPublished ? "btn-outline-secondary" : "btn-outline-success"}`}
                                onClick={() => handleTogglePublish(plan)}
                              >
                                {plan.isPublished ? "Unpublish" : "Publish"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {sortedPlans.length === 0 && !loading && (
                        <tr>
                          <td colSpan={6} className="text-center text-muted py-4">
                            No subscription plans configured yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
