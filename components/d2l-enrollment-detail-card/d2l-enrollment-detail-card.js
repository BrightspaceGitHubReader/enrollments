import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { Rels } from 'd2l-hypermedia-constants';
import 'd2l-organizations/components/d2l-organization-date/d2l-organization-date.js';
import 'd2l-organizations/components/d2l-organization-image/d2l-organization-image.js';
import 'd2l-organizations/components/d2l-organization-name/d2l-organization-name.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
import '../d2l-user-activity-usage/d2l-user-activity-usage.js';
import 'd2l-sequences/components/d2l-sequences-module-list.js';

/**
 * @customElement
 * @polymer
 */
class D2lEnrollmentDetailCard extends mixinBehaviors([D2L.PolymerBehaviors.Siren.EntityBehavior ], PolymerElement) {
	static get template() {
		return html`
			<style include="d2l-typography-shared-styles">
				:host {
					--d2l-enrollment-detail-card-image-shimmer-display: none;
					--d2l-enrollment-detail-card-module-list-display: block;
					--d2l-enrollment-detail-card-text-placeholder-display: none;
					background-color: #ffffff;
					border-radius: 8px;
					box-shadow: 0 4px 8px 2px rgba(0, 0, 0, 0.03);
					box-sizing: border-box;
					display: inline-block;
					overflow: hidden;
					position: relative;
					width: 746px;
					z-index: 0;
				}
				.dedc-base-container {
					align-items: stretch;
					display: flex;
					flex-direction: row;
					height: 100%;
					overflow: hidden;
					position: relative;
				}
				.dedc-container {
					border-radius: 6px;
					height: 100%;
					overflow: hidden;
				}
				.dedc-description-container {
					margin: 0.1rem 0;
				}
				.dedc-description-container p {
					@apply --d2l-body-small-text;
					letter-spacing: 0.4px;
					line-height: 1.5;
					margin: 0;
					padding: 0;
				}
				.dedc-description-placeholder {
					display: block;
					height: 0.6rem;
					margin: 0.45rem 0;
					width: 95%;
				}
				@keyframes loadingShimmer {
					0% { transform: translate3d(-100%, 0, 0); }
					100% { transform: translate3d(100%, 0, 0); }
				}
				.dedc-image {
					background-color: var(--d2l-color-regolith);
					flex-shrink: 0;
					height: 190px;
					line-height: 0;
					overflow: hidden;
					position: relative;
					width: 220px;
				}
				.dedc-image-shimmer {
					background-color: var(--d2l-color-regolith);
					display: var(--d2l-enrollment-detail-card-image-shimmer-display);
					height: 100%;
					left: 0;
					position: absolute;
					top: 0;
					width: 100%;
					z-index: 1;
				}
				.dedc-image d2l-course-image {
					height: 100%;
					width: 100%;
				}
				.dedc-image-shimmer::after {
					animation: loadingShimmer 1.5s ease-in-out infinite;
					background: linear-gradient(90deg, rgba(249, 250, 251, 0.1), rgba(114, 119, 122, 0.1), rgba(249, 250, 251, 0.1));
					background-color: var(--d2l-color-regolith);
					content: '';
					height: 100%;
					left: 0;
					position: absolute;
					top: 0;
					width: 100%;
				}
				.dedc-base-info-container {
					flex-grow: 1;
					margin: 1.2rem 1rem;
					overflow: hidden;
					position: relative;
				}
				.dedc-base-info {
					display: flex;
					flex-grow: 1;
					flex-direction: column;
					width: 100%;
				}
				.dedc-base-info-placeholder {
					background-color: #ffffff;
					display: var(--d2l-enrollment-detail-card-text-placeholder-display);
					height: 100%;
					position: absolute;
					width: 100%;
					z-index: 5;
				}
				.dedc-tag-container,
				.dedc-tag-container span d2l-icon {
					@apply --d2l-body-small-text;
					color: var(--d2l-color-tungsten);
					flex-shrink: 0;
				}
				.dedc-tag-container {
					@apply --d2l-body-small-text;
					margin: 0.7rem 0px;
					letter-spacing: 0.4px;
					line-height: 0.86;
				}
				.dedc-tag-container span d2l-icon {
					--d2l-icon-width: 18px;
					--d2l-icon-height: 18px;
				}
				.dedc-tag-container span:first-child d2l-icon {
					display: none;
				}
				.dedc-tag-container span {
					white-space: nowrap;
				}
				.dedc-tag-placeholder-container {
					display: flex;
					flex-direction: row;
				}
				.dedc-tag-placeholder {
					height: 0.6rem;
					margin-right: 0.5rem;
					width: 5rem;
				}
				.dedc-text-placeholder {
					background-color: var(--d2l-color-sylvite);
					border-radius: 4px;
				}
				.dedc-title {
					@apply --d2l-body-standard-text;
					color: var(--d2l-color-ferrite);
					letter-spacing: 0.4px;
					line-height: 1;
					margin: 0 0 0.1rem 0;
				}
				.dedc-title-placeholder {
					height: 0.85rem;
					margin: 0.075rem 0;
					width: 75%;
				}
				.dedc-module-list {
					display: var(--d2l-enrollment-detail-card-module-list-display);
				}
			</style>
			<div class="dedc-container">
				<div class="dedc-base-container">
					<div class="dedc-image">
						<div class="dedc-image-shimmer"></div>
						<d2l-organization-image href="[[_organizationUrl]]" token="[[token]]"></d2l-organization-image>
					</div>
					<div  class="dedc-base-info-container">
						<!-- Skeleton for text -->
						<div class="dedc-base-info-placeholder">
							<div class="dedc-base-info">
								<div class="dedc-title dedc-text-placeholder dedc-title-placeholder"></div>
								<div class="dedc-tag-container dedc-tag-placeholder-container">
									<div class="dedc-text-placeholder dedc-tag-placeholder"></div>
									<div class="dedc-text-placeholder dedc-tag-placeholder"></div>
								</div>
								<div class="dedc-description-container">
									<div class="dedc-text-placeholder dedc-description-placeholder"></div>
									<div class="dedc-text-placeholder dedc-description-placeholder"></div>
								</div>
							</div>
						</div>
						<!-- Real text part -->
						<div class="dedc-base-info">
							<h3 class="dedc-title"><d2l-organization-name href="[[_organizationUrl]]"  token="[[token]]"></d2l-organization-name></h3>
							<div class="dedc-tag-container" hidden$="[[!_userActivityUsageUrl]]">
									<span>
										<d2l-icon icon="d2l-tier1:bullet"></d2l-icon>
										<d2l-user-activity-usage href="[[_userActivityUsageUrl]]">
											<d2l-organization-date slot="default" href="[[_organizationUrl]]"></d2l-organization-date>
										</d2l-user-activity-usage>
									</span>
							</div>
							<div class="dedc-description-container">
								<p>[[_description]]</p>
							</div>
						</div>
					</div>
				</div>
				<d2l-sequences-module-list class="dedc-module-list" href="[[_sequenceLink]]" token="[[token]]"></d2l-sequences-module-list>
			</div>
		`;
	}

	static get properties() {
		return {
			_description: String,
			_image: String,
			_organizationUrl: String,
			_sequenceLink: String,
			_tags: String,
			_title: String,
			_userActivityUsageUrl: String
		};
	}
	static get observers() {
		return [
			'_handleEnrollmentData(entity)'
		];
	}

	_handleEnrollmentData(enrollment) {
		if (
			!enrollment
			|| !enrollment.hasLinkByRel
			|| !enrollment.hasLinkByRel(Rels.organization)
		) {
			return;
		}
		this._organizationUrl = enrollment.getLinkByRel(Rels.organization).href;

		if (enrollment.hasLinkByRel(Rels.Activities.userActivityUsage)) {
			this._userActivityUsageUrl = enrollment.getLinkByRel(Rels.Activities.userActivityUsage).href;
		}

		// this will require an update as well. I am hoping this can happen when the new POC comes out.
		return this._myEntityStoreFetch(this._organizationUrl)
			.then(this._handleOrganizationResponse.bind(this));
	}

	_handleOrganizationResponse(organization) {
		organization = organization && organization.entity;

		let description = organization.properties && organization.properties.description;
		if (description) {
			description = description.replace(/<[^>]*>/g, '');
		}
		this._description = description;
		this._sequenceLink = organization.getLinkByRel('https://api.brightspace.com/rels/sequence').href;

		return Promise.resolve();
	}

	_myEntityStoreFetch(url) {
		return window.D2L.Siren.EntityStore.fetch(url, this.token);
	}
}

window.customElements.define('d2l-enrollment-detail-card', D2lEnrollmentDetailCard);

// Make shared style so it is easy to mass hide loading.
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<custom-style>
	<style is="custom-style">
		html {

			--d2l-enrollment-detail-card-loading: {
				--d2l-enrollment-detail-card-image-shimmer-display: block;
				--d2l-enrollment-detail-card-module-list-display: none;
				--d2l-enrollment-detail-card-text-placeholder-display: block;
			};

			--d2l-enrollment-detail-card-loading-text: {
				--d2l-enrollment-detail-card-module-list-display: none;
				--d2l-enrollment-detail-card-text-placeholder-display: block;
			};

			--d2l-enrollment-detail-card-loading-image: {
				--d2l-enrollment-detail-card-image-shimmer-display: block;
			};

		}
	</style>
</custom-style>`;

document.head.appendChild($_documentContainer.content);
